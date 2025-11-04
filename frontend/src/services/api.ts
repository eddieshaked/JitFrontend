import type { GenerateElementsRequest, GenerateElementsResponse } from '@shared/types/elements';
import { apiClient } from './apiClient';

export const apiService = {
  async generateElements(request: GenerateElementsRequest): Promise<GenerateElementsResponse> {
    const response = await apiClient.post<GenerateElementsResponse>(
      '/generate-elements',
      request
    );
    return response.data;
  },
};
