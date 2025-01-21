export interface System {
  name: string;
  displayName: string;
}

export interface Version {
  id: string;
  version: string;
}

export interface ProvisioningStatus {
  isProvisioning: boolean;
  isDeprovisioning: boolean;
  error: string | null;
  success: boolean;
}