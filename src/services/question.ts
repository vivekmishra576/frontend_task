import api from './api';
import { Question, ApiResponse } from '../types';

export const questionService = {
  async bulkCreateQuestions(questions: Question[]): Promise<Question[]> {
    const response = await api.post<ApiResponse<Question[]>>('/questions/bulk', { questions });
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  },

  async fetchBulkQuestions(questionIds: string[]): Promise<Question[]> {
    const response = await api.post<ApiResponse<Question[]>>('/questions/fetchBulk', { question_ids: questionIds });
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  }
};

export default questionService;
