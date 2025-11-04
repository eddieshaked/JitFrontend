import type { GenerateElementsRequest, GenerateElementsResponse } from '@shared/types/elements';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../../services/api';

export const useGenerateElements = () => {
  return useMutation<GenerateElementsResponse, Error, GenerateElementsRequest>({
    mutationFn: (request: GenerateElementsRequest) => apiService.generateElements(request),
  });
};

