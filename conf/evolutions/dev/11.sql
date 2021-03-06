# --- !Ups

CREATE TABLE USER_PERMISSION (
    ID                 INT UNSIGNED NOT NULL AUTO_INCREMENT,
    ROLE_ID            INT UNSIGNED NOT NULL,
    ACTIVE             BOOLEAN NOT NULL,
    READ_PERM          BOOLEAN NOT NULL,
    WRITE_PERM         BOOLEAN NOT NULL,
    EXECUTE_PERM       BOOLEAN NOT NULL,
    CREATED_TIME       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    MODIFIED_TIME      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE          CURRENT_TIMESTAMP,
    CONSTRAINT         UPERM_ROLE_READ_WRITE_EXECUTE_UC
      UNIQUE             (ROLE_ID, READ_PERM, WRITE_PERM, EXECUTE_PERM),
    CONSTRAINT         UPERM_ROLE_FK
      FOREIGN KEY        (ROLE_ID)
      REFERENCES         USER_ROLE (ID),
    PRIMARY KEY        (ID)
);

# --- !Downs

SET UNIQUE_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS USER_PERMISSION;
SET FOREIGN_KEY_CHECKS = 1;
SET UNIQUE_CHECKS = 1;
