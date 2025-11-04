import { useMutation } from '@tanstack/react-query';
import type { GenerateElementsRequest, GenerateElementsResponse } from '@shared/types/elements';
import { apiService } from '../../../services/api';

/**
 * Hook for generating elements using React Query mutation
 */
export const useGenerateElements = () => {
  return useMutation<GenerateElementsResponse, Error, GenerateElementsRequest>({
    mutationFn: (request: GenerateElementsRequest) => apiService.generateElements(request),
  });
};

