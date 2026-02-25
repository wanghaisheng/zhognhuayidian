import React from 'react';
import { useParams } from '@tanstack/react-router';
import { DeviceCategoryPage } from '../../pages/DeviceCategoryPage';
import { DeviceDetailPage } from '../../pages/DeviceDetailPage';
import DeviceSpecificationPage from '../../pages/DeviceSpecificationPage';
import { DEVICE_SPECIFICATIONS } from '@/config/constants';

/**
 * 智能设备路由组件
 * 根据URL参数智能判断是规格页面还是设备详情页面
 */
export const DeviceRouter: React.FC = () => {
  const params = useParams({ strict: false }) as {
    category?: string;
    slug?: string;
    specification?: string;
  };
  const category = params?.category;
  const slug = params?.slug;
  const specification = params?.specification;

  // 如果有specification参数，说明是4段路径：/devices/ct-scanners/128-slice/device-slug
  if (specification && slug) {
    return <DeviceDetailPage />;
  }

  // 如果只有category和slug，需要判断slug是规格还是设备
  if (category && slug) {
    // 检查slug是否是已知的规格类型
    if ((DEVICE_SPECIFICATIONS as readonly string[]).includes(slug)) {
      // 是规格页面：/devices/ct-scanners/128-slice
      return <DeviceSpecificationPage />;
    } else {
      // 是设备详情页面：/devices/ct-scanners/device-slug
      return <DeviceDetailPage />;
    }
  }

  // 如果只有category，是分类页面：/devices/ct-scanners
  if (category) {
    return <DeviceCategoryPage />;
  }

  // 默认返回分类页面（这种情况不应该发生）
  return <DeviceCategoryPage />;
};
