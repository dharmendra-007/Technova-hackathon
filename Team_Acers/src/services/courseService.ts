
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  name: string;
  outcomes?: any;
}

export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, outcomes');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const addCourse = async (course: Omit<Course, 'id'>): Promise<Course> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        name: course.name,
        outcomes: course.outcomes
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};
