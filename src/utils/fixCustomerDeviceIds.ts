// Fix invalid device IDs in customer data
export const fixCustomerDeviceIds = () => {
  console.log('🔧 Fixing device IDs in customer data...');
  
  // Device ID mapping table
  const deviceIdMapping = {
    'siemens-device': 'siemens-somatom-drive',
    'united-imaging-device': 'uih-uct-860',
    'united-imaging-advanced': 'uih-uct-960-plus'
  };
  
  // Device name mapping table
  const deviceNameMapping = {
    'Siemens CT': 'SOMATOM Drive',
    'United Imaging CT': 'uCT 860',
    'United Imaging Advanced CT': 'uCT 960+'
  };
  
  console.log('📋 Device ID mappings to fix:');
  Object.entries(deviceIdMapping).forEach(([oldId, newId]) => {
    console.log(`  ${oldId} → ${newId}`);
  });
  
  console.log('✅ Device ID mapping table ready');
  console.log('💡 Please manually update the following records in customer data file:');
  
  // Provide fix instructions
  const fixInstructions = [
    {
      customer: 'Haiyan County People\'s Hospital',
      oldDeviceId: 'siemens-device',
      newDeviceId: 'siemens-somatom-drive',
      newDeviceName: 'SOMATOM Drive'
    },
    {
      customer: 'Changxing County TCM Hospital',
      oldDeviceId: 'siemens-device',
      newDeviceId: 'siemens-somatom-go-up',
      newDeviceName: 'Somatom Go Up'
    },
    {
      customer: 'Gucheng County Hospital, Hebei',
      oldDeviceId: 'united-imaging-device',
      newDeviceId: 'uih-uct-860',
      newDeviceName: 'uCT 860'
    },
    {
      customer: 'First Affiliated Hospital of Sun Yat-sen University Guangxi Hospital',
      oldDeviceId: 'united-imaging-advanced',
      newDeviceId: 'uih-uct-960-plus',
      newDeviceName: 'uCT 960+'
    },
    {
      customer: 'Yining County People\'s Hospital',
      oldDeviceId: 'united-imaging-device',
      newDeviceId: 'uih-uct-528',
      newDeviceName: 'uCT 528'
    },
    {
      customer: 'Shuguang Hospital Affiliated to Shanghai University of TCM',
      oldDeviceId: 'united-imaging-device',
      newDeviceId: 'uih-uct-860',
      newDeviceName: 'uCT 860'
    },
    {
      customer: 'Peking University Third Hospital',
      oldDeviceId: 'united-imaging-device',
      newDeviceId: 'uih-uct-960-plus',
      newDeviceName: 'uCT 960+'
    },
    {
      customer: 'Fudan University Shanghai Cancer Center',
      oldDeviceId: 'united-imaging-device',
      newDeviceId: 'uih-uct-860',
      newDeviceName: 'uCT 860'
    }
  ];
  
  fixInstructions.forEach((instruction, index) => {
    console.log(`${index + 1}. ${instruction.customer}:`);
    console.log(`   ${instruction.oldDeviceId} → ${instruction.newDeviceId}`);
    console.log(`   Device name: ${instruction.newDeviceName}`);
  });
  
  return fixInstructions;
};

// Auto-run in development environment
if (import.meta.env.DEV) {
  setTimeout(() => {
    fixCustomerDeviceIds();
  }, 4000);
}