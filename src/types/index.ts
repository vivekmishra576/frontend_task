export interface User {
  id?: string;
  userId: string;
  name?: string;
  role?: string;
  subrole?: string;
  phone?: string;
  joiningDate?: string;
  endDate?: string;
  lastActive?: string;
  payment?: boolean;
}

export interface LoginCredentials {
  userId: string;
  password?: string;
}

export interface LoginResponse {
  status?: string;
  success?: boolean;
  message?: string;
  data: {
    token: string;
    user?: User;
  };
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface Test {
  id: string;
  name: string;
  type?: string;
  subject: string;
  topics: string[];
  sub_topics?: string[];
  status: 'draft' | 'live' | string | null;
  created_at?: string;
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  questions?: string[] | Question[];
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: string;
  total_time: number;
  total_marks: number;
  total_questions?: number;
  status?: string | null;
}

export interface Question {
  id?: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: 'option1' | 'option2' | 'option3' | 'option4' | string;
  explanation?: string;
  difficulty?: string;
  test_id?: string;
  topic_id?: string;
  sub_topic_id?: string;
  media_url?: string;
  subject?: string;
}

export interface ApiResponse<T> {
  status?: string;
  success?: boolean;
  message?: string;
  data: T;
}
