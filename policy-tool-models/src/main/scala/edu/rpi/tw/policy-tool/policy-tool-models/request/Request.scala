package edu.rpi.tw.policy_tool.policy_tool_models.request

import edu.rpi.tw.policy_tool.policy_tool_models.common.{Thing, Agent}

case class Request (
    dateRange: Option[RequestDateRange],
    //frequencyRange: Option[FrequencyRange],
    id: RequestId,
    //location: Option[WellKnownText],
    agent: Agent
) extends Thing