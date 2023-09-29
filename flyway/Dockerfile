FROM flyway/flyway:9.8.3-alpine

# building the image inside the `flyway` -folder
COPY sql/ /flyway/sql/

# Use shell form for entrypoint to get access to env variables
ENTRYPOINT ./flyway migrate -user=$FLYWAY_USER -password=$FLYWAY_PASSWORD -url="jdbc:postgresql://${VISIT_COUNTER_APP_DATABASE_CLUSTER_RW_SERVICE_HOST}:${VISIT_COUNTER_APP_DATABASE_CLUSTER_RW_SERVICE_PORT}/${FLYWAY_USER}"