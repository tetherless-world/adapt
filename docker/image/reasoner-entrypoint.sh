#!/bin/sh

REASONER_PATH="/adapt-reasoner/adapt-reasoner-1.0-SNAPSHOT/bin/adapt-reasoner"
if [ -f "${REASONER_PATH}" ]; then
  $REASONER_PATH
else
  echo "Unable to locate ADAPT Reasoner application at ${REASONER_PATH}, not starting"
fi

exec "$@"
