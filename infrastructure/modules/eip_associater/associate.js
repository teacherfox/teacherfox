const { EC2Client, AssociateAddressCommand } = require("@aws-sdk/client-ec2");

const client = new EC2Client({ region: process.env.AWS_REGION });

const associateEip = async (instanceId, eipId) => {
  const command = new AssociateAddressCommand({
    AllocationId: eipId,
    InstanceId: instanceId
  });
  return client.send(command);
};

exports.handler = async (event) => {
  for (let i = 0; i < event.Records.length; i++) {
    const body = JSON.parse(event.Records[i].body);
    const msg = JSON.parse(body.Message);

    if (msg.Event === 'autoscaling:EC2_INSTANCE_LAUNCH') {
      await associateEip(msg.EC2InstanceId, process.env.EIP_ID);
    }
  }

  return { success: true };
};
