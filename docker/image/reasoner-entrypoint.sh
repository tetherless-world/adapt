#!/bin/sh

REASONER_PATH="/policy-tool-reasoner/policy-tool-reasoner-1.0-SNAPSHOT/bin/policy-tool-reasoner"
if [ -f "${REASONER_PATH}" ]; then
  $REASONER_PATH
else
  echo "Unable to locate Policy Tool Reasoner application at ${REASONER_PATH}, not starting"
fi

exec "$@"
