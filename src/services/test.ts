import api from './api';
import { Subject, Topic, SubTopic, Test, CreateTestPayload, ApiResponse } from '../types';

export const testService = {
  async getSubjects(): Promise<Subject[]> {
    const response = await api.get<ApiResponse<Subject[]>>('/subjects');
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  },

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    const response = await api.get<ApiResponse<Topic[]>>(`/topics/subject/${subjectId}`);
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  },

  async getSubTopicsByTopic(topicId: string): Promise<SubTopic[]> {
    const response = await api.get<ApiResponse<SubTopic[]>>(`/sub-topics/topic/${topicId}`);
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  },

  async getSubTopicsByMultiTopics(topicIds: string[]): Promise<SubTopic[]> {
    const response = await api.post<ApiResponse<SubTopic[]>>('/sub-topics/multi-topics', { topicIds });
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  },

  async getTests(): Promise<Test[]> {
    const response = await api.get<ApiResponse<Test[]>>('/tests');
    return response.data?.data || (Array.isArray(response.data) ? response.data : []);
  },

  async getTestById(id: string): Promise<Test> {
    const response = await api.get<ApiResponse<Test>>(`/tests/${id}`);
    return response.data?.data || (response.data as any);
  },

  async createTest(payload: CreateTestPayload): Promise<Test> {
    const response = await api.post<ApiResponse<Test>>('/tests', payload);
    return response.data?.data || (response.data as any);
  },

  async updateTest(id: string, payload: Partial<Test>): Promise<Test> {
    const response = await api.put<ApiResponse<Test>>(`/tests/${id}`, payload);
    return response.data?.data || (response.data as any);
  },

  async publishTest(id: string): Promise<Test> {
    const response = await api.put<ApiResponse<Test>>(`/tests/${id}`, { status: 'live' });
    return response.data?.data || (response.data as any);
  },

  async deleteTest(id: string): Promise<boolean> {
    try {
      await api.delete(`/tests/${id}`);
      return true;
    } catch {
      return true;
    }
  }
};

export default testService;
