package edu.rpi.tw.policy_tool.policy_tool_models.request

import java.time.ZonedDateTime
import java.util.Date

case class RequestDateRange(from: ZonedDateTime, until: ZonedDateTime)