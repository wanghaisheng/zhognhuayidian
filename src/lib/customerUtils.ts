import type { Customer } from '../types/customer';
const modules = import.meta.glob('/src/data/snapshots/**/content/customers/*.json', { eager: true });
const customers: Customer[] = Object.values(modules).map((m: unknown) => (m as { default?: unknown }).default ?? m) as Customer[];

// Customer utility functions
export const getCustomersByManufacturer = (manufacturerId: string) => {
  return customers.filter(customer =>
    customer.partnerships.includes(manufacturerId)
  );
};

export const getCustomersByBrand = (brandId: string) => {
  return customers.filter(customer =>
    customer.purchaseHistory.some(purchase => purchase.brandId === brandId)
  );
};

export const getCustomersByCountry = (country: string) => {
  return customers.filter(customer => customer.location.country === country);
};

export const getCustomersByProvince = (province: string) => {
  return customers.filter(customer => customer.location.province === province);
};

export const getCustomersByType = (type: Customer['type']) => {
  return customers.filter(customer => customer.type === type);
};

export const getCustomersBySize = (size: Customer['size']) => {
  return customers.filter(customer => customer.size === size);
};

export const getCustomersWithCaseStudies = () => {
  return customers.filter(customer => customer.caseStudies && customer.caseStudies.length > 0);
};

export const getTopCustomersByVolume = (limit: number = 10) => {
  return customers
    .filter(customer => customer.patientVolumePerYear)
    .sort((a, b) => (b.patientVolumePerYear || 0) - (a.patientVolumePerYear || 0))
    .slice(0, limit);
};

export const getCustomerStats = () => {
  const totalCustomers = customers.length;
  const customersByCountry = customers.reduce((acc, customer) => {
    acc[customer.location.country] = (acc[customer.location.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const customersByType = customers.reduce((acc, customer) => {
    acc[customer.type] = (acc[customer.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const customersBySize = customers.reduce((acc, customer) => {
    acc[customer.size] = (acc[customer.size] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalBedCount = customers.reduce((sum, customer) => sum + (customer.bedCount || 0), 0);
  const totalPatientVolume = customers.reduce((sum, customer) => sum + (customer.patientVolumePerYear || 0), 0);

  return {
    totalCustomers,
    customersByCountry,
    customersByType,
    customersBySize,
    totalBedCount,
    totalPatientVolume,
    averageBedCount: Math.round(totalBedCount / customers.filter(c => c.bedCount).length),
    averagePatientVolume: Math.round(totalPatientVolume / customers.filter(c => c.patientVolumePerYear).length)
  };
};

// Get customer geographic data
export const getCustomerGeographicData = () => {
  return customers.map(customer => ({
    id: customer.id,
    name: customer.name,
    coordinates: customer.location.coordinates,
    city: customer.location.city,
    province: customer.location.province,
    country: customer.location.country,
    type: customer.type,
    size: customer.size,
    partnerships: customer.partnerships,
    patientVolume: customer.patientVolumePerYear
  }));
};
