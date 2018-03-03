package aurita.models
import play.api.libs.json._
import aurita.models.utility.Common

/** Provide the availability status of some entity.
  *
  * Data model for the
  * [[aurita.daos.CurrentStatusDAOInterface.CurrentStatusDAOImpl.tableQuery status]]
  * database table.
  *
  * @constructor create a new map position for an user.
  * @param id the primary key
  * @param userId
  * @param lat latitude
  * @param lng longitude
  */
case class MapPosition(id: Option[Long], userId: Option[Long] = Some(0L), lat: Double, lng: Double) 
  extends Common[MapPosition] {}
case class MapPositionStatus(status: String, lat: Double, lng: Double)


object MapPositionStatus {
    implicit val MapPositionStatusFormat: Format[MapPositionStatus] = Json.format[MapPositionStatus]
}
object MapPosition {
    implicit val MapPositionFormat: Format[MapPosition] = Json.format[MapPosition]
}