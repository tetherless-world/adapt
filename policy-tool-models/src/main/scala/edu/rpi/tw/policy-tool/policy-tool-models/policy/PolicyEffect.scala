package edu.rpi.tw.policy_tool.policy_tool_models.policy

sealed trait PolicyEffect {
    val reason: String
}

case class DenyPolicyEffect(reason: String) extends PolicyEffect
case class PermitPolicyEffect(reason: String) extends PolicyEffect
case class OtherPolicyEffect(reason: String) extends PolicyEffect