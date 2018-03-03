package aurita.daos

import scala.concurrent.Future
import slick.dbio.Effect.{ Read, Write, Schema }
import slick.sql.FixedSqlAction
import aurita.daos.utility.{ DAOHelpers, CRUD }
import aurita.models.MapPosition

/** Provide the declaration of data access methods associated with the
  * [[MapPositionDAOInterface.MapPositionDAOImpl.tableQuery status]]
  * database table.
  *
  * The methods are defined in
  * [[MapPositionDAOInterface.MapPositionDAOImpl MapPositionDAOImpl]].
  *
  */
trait MapPositionDAO extends CRUD[MapPosition] {
  import slick.dbio.{ DBIOAction, NoStream }

  /** Get the current map position row associate with a given map position.
    *
    * @param key the [[aurita.models.MapPosition map position]] key.
    * @param key the [[aurita.models.MapPosition map position]] value.
    * @return the current map position row.
    */
  def getMapPosition(): DBIOAction[Option[MapPosition], NoStream, Read]
  def createMapPosition(p: MapPosition): DBIOAction[Int, NoStream, Write]
  def updateMapPosition(p: MapPosition): DBIOAction[Int, NoStream, Write]
  def migrate: DBIOAction[Unit, NoStream, Schema]
}

/** Provides DAO interface for data access to the
  * [[MapPositionDAOInterface.MapPositionDAOImpl.tableQuery map position]]
  * database table.
  *
  * ==Overview==
  * The implemented instance of [[MapPositionDAO]] is accessed by mixing in
  * [[MapPositionDAOInterface]]
  * {{{
  * class Foo(id: Long) extends MapPositionDAOInterface {
  *   def fooFn: MapPosition = mapPositionDAO.findById(id)
  * }
  * }}}
  *
  * You can also access [[MapPositionTable]]
  * {{{
  * class Foo() extends MapPositionDAOInterface {
  *   val tableQuery: TableQuery[MapPositionTable] =
  *     TableQuery[MapPositionTable]
  * }
  * }}}
  */
trait MapPositionDAOInterface extends DAOHelpers {
  import profile.api._
  import com.softwaremill.macwire.wire
  import scala.concurrent.ExecutionContext

  implicit val executionContext: ExecutionContext

  /** The map position data access implementation instance. */
  lazy val mapPositionDAO: MapPositionDAO = wire[MapPositionDAOImpl]

  /** Implementation of data access methods associated with the
    * [[MapPositionDAOImpl.tableQuery map position]] database table.
    */
  class MapPositionDAOImpl() extends MapPositionDAO
    with CRUDImpl[MapPositionTable, MapPosition] {

    /** The map position database table.
      * @see [[http://slick.typesafe.com/doc/3.1.0/schemas.html#table-query]]
      */
    protected val tableQuery = TableQuery[MapPositionTable]

    def getMapPosition(): DBIOAction[Option[MapPosition], NoStream, Read] = {
      tableQuery.result.headOption
    }

    def createMapPosition(p: MapPosition): DBIOAction[Int, NoStream, Write] = tableQuery += p

    def updateMapPosition(p: MapPosition): DBIOAction[Int, NoStream, Write] = {
      tableQuery.filter(_.id === p.id).update(p)
    }
    def migrate:DBIOAction[Unit, NoStream, Schema] = (tableQuery.schema).create


  }

  /** The map position database table row.
    * @see [[http://slick.typesafe.com/doc/3.1.0/schemas.html#table]]
    */
  class MapPositionTable(tag: Tag)
    extends RichTable[MapPosition](
      tag = tag, name = "MAP_POSITION", idTypeInfo = "int unsigned not null"
    ) {


    def userId = column[Option[Long]](
      "USER_ID", O.Length(length = 254, varying = true)
    )

    def lat =
      column[Double]("LAT", O.Length(length = 32, varying = true))

    def lng =
      column[Double]("LNG", O.Length(length = 32, varying = true))


    def * = (
      id.?,
      userId,
      lat,
      lng
    ) <> ((MapPosition.apply _).tupled, MapPosition.unapply)

    def ? = (
      id.?,
      userId,
      lat,
      lng
    ).shaped <> (
      {
        r =>
          import r._
          _1.map(_ => (MapPosition.apply _).tupled((_1, _2, _3, _4)))
      },
      maybeUnapply
    )
  }
}