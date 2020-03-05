package edu.rpi.tw.policy_tool.policy_tool_models.policy

import edu.rpi.tw.policy_tool.policy_tool_models.common.{Thing}

case class Policy (
    dateRange: Option[PolicyDateRange] = None,
    definition: Option[String] = None,
    effect: Option[PolicyEffect] = None,
    extendsPolicyId: Option[PolicyId] = None,
    id: PolicyId,
    label: Option[String] = None,
    //location: Option[PolicyLocationRef] = None,
    priority: Option[PolicyPriority] = None,
    agent: Option[Agent] = None
    //frequencyRange: Option[FrequencyRange] = None,
) extends Thing