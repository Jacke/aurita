package aurita.actors

import akka.actor.{ Props, Actor, ActorRef, ActorSystem }
import play.api.libs.json._
import aurita.models.{MapPosition, MapPositionStatus}
abstract class SocketClientFactory {
  def socketClientProps(userId: Long, actorSystem: ActorSystem, out: ActorRef): Props
}

/** Companion to the [[SocketClient Websocket client]].
  *
  */
class SocketClientFactoryImpl() extends SocketClientFactory {
  import com.softwaremill.macwire.wire

  def socketClientProps(userId: Long, actorSystem: ActorSystem, out: ActorRef): Props = Props(wire[SocketClient])
}

/** The actor receiving messages from the [[aurita.controllers.HomeController.stream Websocket]] connection
  * to the frontend user
  *
  * @constructor create a new channel actor to receive requests from the frontend user
  * @param userId the id of the frontend user connected to the channel
  */
class SocketClient(userId: Long, system: ActorSystem, out: ActorRef) extends Actor {
  import play.api.libs.json.Json
  import aurita.actors.utility.TaskProtocol.{
    HandshakeResponse, HandshakeRequest, Tick, Tock
  }

  lazy val logger = new aurita.utility.messages.Log(this.getClass)

  def receive = active

  def active(): Receive = {
    case payload: JsValue => {
      logger.info(s"${self.path} received message: ${payload}.")
      if (payload.asOpt[MapPosition].isDefined) {
        val position = payload.as[MapPosition]
        system.actorSelection("akka://application/user/*/flowActor") ! MapPositionStatus(status = "updated", position.lat, position.lng)
      }
    }

    case positionStatus: MapPositionStatus => {
      logger.info(s"${self.path} received ${positionStatus}")
      out ! Json.toJson(positionStatus)
    }

    case tick: Tick => logger.info(s"${self.path} received ${tick}")

    case tock: Tock => {
      logger.info(s"${self.path} received ${tock}")
    }

    case handshake: HandshakeRequest => logger.info(
      s"${self.path} received ${handshake}"
    )

    case handshake: HandshakeResponse => logger.info(
      s"${self.path} received handshake response = ${handshake}"
    )

    case msg: Any => {
      logger.info(s"${self.path} received message: $msg.")
    }

    case _ => {
      logger.info(s"${self.path} received message:.")
    }    
  }
}
