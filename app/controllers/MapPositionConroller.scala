package aurita.controllers

import play.api.mvc.{
  AbstractController, Action, AnyContent, ControllerComponents, Request, WebSocket
}
import play.api.libs.json._
import play.api.Environment
import play.api.libs.ws.WSClient
import com.softwaremill.tagging.@@
import akka.actor.ActorSystem
import akka.stream.Materializer
import scala.concurrent.ExecutionContext
import controllers.Assets
import aurita.MainActorSystemTag
import aurita.actors.SocketClientFactory
import aurita.utility.auth.DefaultEnv
import aurita.daos._
import slick.basic.DatabaseConfig
import slick.jdbc.JdbcProfile

/**
 * This controller manage `Map positions` to handle HTTP requests from user
 */
class MapPositionConroller(
  assets: Assets,
  cc: ControllerComponents,
  val dbConfig: DatabaseConfig[JdbcProfile],
  socketClientFactory: SocketClientFactory,
  system: ActorSystem @@ MainActorSystemTag,
  environment: Environment,
  ws: WSClient
)(
  implicit val materializer: Materializer,
  implicit val executionContext: ExecutionContext
) extends AbstractController(cc) with MapPositionDAOInterface {
  import play.api.libs.streams.ActorFlow
  import play.api.Mode
  import controllers.Assets
  import scala.concurrent.Future

  val DEFAULT_POSITION = aurita.models.MapPosition(None, Some(0L), -25.363, 131.044)

  def mainPosition() = Action.async {
    implicit rs => 
    db.run(mapPositionDAO.getMapPosition()).map { positionOpt =>
      positionOpt match {
        case Some(position) => Ok(Json.toJson(position))
        case _ => Ok(Json.toJson(DEFAULT_POSITION))
      }
    }
  }

  def savePoisition(lat: Double, lon: Double) = Action.async {
    implicit rs => 
    db.run(mapPositionDAO.getMapPosition()).flatMap { positionOpt =>
      positionOpt match {
        case Some(position) => db.run(mapPositionDAO.updateMapPosition(position.copy(lat = lat, lon = lon))).map { _ =>
          Ok(Json.toJson(Map("status" -> "ok")))
        }
        case _ => db.run(mapPositionDAO.createMapPosition(DEFAULT_POSITION.copy(lat = lat, lon = lon))).map { _ =>
          Ok(Json.toJson(Map("status" -> "ok")))
        }
      }      
    }
  }

}