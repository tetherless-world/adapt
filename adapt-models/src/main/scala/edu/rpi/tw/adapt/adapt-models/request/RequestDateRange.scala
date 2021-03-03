package edu.rpi.tw.adapt.adapt_models.request

import java.time.ZonedDateTime
import java.util.Date

case class RequestDateRange(from: ZonedDateTime, until: ZonedDateTime)