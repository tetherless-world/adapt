package edu.rpi.tw.adapt.adapt_models.policy

sealed trait PolicyEffect {
    val reason: String
}

case class DenyPolicyEffect(reason: String) extends PolicyEffect
case class PermitPolicyEffect(reason: String) extends PolicyEffect
case class OtherPolicyEffect(reason: String) extends PolicyEffect