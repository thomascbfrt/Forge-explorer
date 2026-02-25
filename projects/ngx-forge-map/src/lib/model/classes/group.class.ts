import {
  GroupJSON,
  GroupBranchProtectionJSON,
} from '../interfaces/group.model';

export class Group {
  public readonly id: number;
  public readonly web_url: string;
  public readonly name: string;
  public readonly path: string;
  public readonly description: string;
  public readonly visibility: string;
  public readonly share_with_group_lock: boolean;
  public readonly require_two_factor_authentication: boolean;
  public readonly two_factor_grace_period: number;
  public readonly project_creation_level: string;
  public readonly auto_devops_enabled: null;
  public readonly subgroup_creation_level: string;
  public readonly emails_disabled: boolean;
  public readonly emails_enabled: boolean;
  public readonly mentions_disabled: null;
  public readonly lfs_enabled: boolean;
  public readonly math_rendering_limits_enabled: boolean;
  public readonly lock_math_rendering_limits_enabled: boolean;
  public readonly default_branch: null;
  public readonly default_branch_protection: number;
  public readonly default_branch_protection_defaults: GroupBranchProtectionJSON;
  public readonly avatar_url: null;
  public readonly request_access_enabled: boolean;
  public readonly full_name: string;
  public readonly full_path: string;
  public readonly created_at: string;
  public readonly parent_id: number;
  public readonly organization_id: number;
  public readonly shared_runners_setting: string;
  public readonly max_artifacts_size: null;

  constructor(group: GroupJSON) {
    this.id = group.id;
    this.web_url = group.web_url;
    this.name = group.name;
    this.path = group.path;
    this.description = group.description;
    this.visibility = group.visibility;
    this.share_with_group_lock = group.share_with_group_lock;
    this.require_two_factor_authentication =
      group.require_two_factor_authentication;
    this.two_factor_grace_period = group.two_factor_grace_period;
    this.project_creation_level = group.project_creation_level;
    this.auto_devops_enabled = group.auto_devops_enabled;
    this.subgroup_creation_level = group.subgroup_creation_level;
    this.emails_disabled = group.emails_disabled;
    this.emails_enabled = group.emails_enabled;
    this.mentions_disabled = group.mentions_disabled;
    this.lfs_enabled = group.lfs_enabled;
    this.math_rendering_limits_enabled = group.math_rendering_limits_enabled;
    this.lock_math_rendering_limits_enabled =
      group.lock_math_rendering_limits_enabled;
    this.default_branch = group.default_branch;
    this.default_branch_protection = group.default_branch_protection;
    this.default_branch_protection_defaults =
      group.default_branch_protection_defaults;
    this.avatar_url = group.avatar_url;
    this.request_access_enabled = group.request_access_enabled;
    this.full_name = group.full_name;
    this.full_path = group.full_path;
    this.created_at = group.created_at;
    this.parent_id = group.parent_id;
    this.organization_id = group.organization_id;
    this.shared_runners_setting = group.shared_runners_setting;
    this.max_artifacts_size = group.max_artifacts_size;
  }
}
