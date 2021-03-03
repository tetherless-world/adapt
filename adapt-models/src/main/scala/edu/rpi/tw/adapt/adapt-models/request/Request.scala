package edu.rpi.tw.adapt.adapt_models.request

import edu.rpi.tw.adapt.adapt_models.common.{Thing, Agent}

case class Request (
    dateRange: Option[RequestDateRange],
    //frequencyRange: Option[FrequencyRange],
    id: RequestId,
    //location: Option[WellKnownText],
    agent: Agent
) extends Thing