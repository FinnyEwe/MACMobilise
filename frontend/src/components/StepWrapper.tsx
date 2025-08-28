'use client';

import { usePathname } from 'next/navigation';
import Stepper from '@/components/Stepper';

export default function StepperWrapper() {
  const pathname = usePathname();

  // You can decide which step to highlight based on route
  const stepMap: Record<string, number> = {
    '/': 0,
    '/drivers': 1,
    '/passengers': 2,
    '/destination': 3,
  };

  const currentStep = stepMap[pathname] ?? 0;

  return <Stepper id={currentStep} />;
}
