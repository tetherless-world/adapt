package edu.rpi.tw.adapt.adapt_models.policy

import java.time.{Instant, ZonedDateTime}
import java.util.Date

case class PolicyDateRange(from: Option[ZonedDateTime], until: Option[ZonedDateTime])