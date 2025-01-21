const AZURE_DEVOPS_BASE_URL = 'https://dev.azure.com/your-organization';

interface PipelineParameters {
  systemNames: string[];
  version: string;
}

export async function triggerProvisioningPipeline(params: PipelineParameters): Promise<void> {
  const response = await fetch(`${AZURE_DEVOPS_BASE_URL}/provision-pipeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AZURE_DEVOPS_TOKEN}`,
    },
    body: JSON.stringify({
      parameters: {
        systems: params.systemNames.join(','),
        version: params.version,
        // Add additional parameters as needed
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to trigger provisioning pipeline');
  }
}

export async function triggerDeprovisioningPipeline(params: PipelineParameters): Promise<void> {
  const response = await fetch(`${AZURE_DEVOPS_BASE_URL}/deprovision-pipeline`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AZURE_DEVOPS_TOKEN}`,
    },
    body: JSON.stringify({
      parameters: {
        systems: params.systemNames.join(','),
        version: params.version,
        // Add additional parameters as needed
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to trigger deprovisioning pipeline');
  }
}