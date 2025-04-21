
import { supabase } from "@/integrations/supabase/client";
import { Assessment, Question, AssessmentDB, AssessmentQuestionDB } from "@/utils/types";
import { mockAssessments } from "@/utils/mockData";

// Use mock data until the tables are created in the database
export const fetchAssessments = async (): Promise<Assessment[]> => {
  try {
    // This would be the actual implementation once the tables are created
    /*
    const { data, error } = await supabase
      .from('assessments')
      .select('*');
    
    if (error) throw error;
    
    // We need to fetch questions separately since they're in a separate table
    const assessments: Assessment[] = [];
    
    for (const assessment of data) {
      const questions = await fetchQuestionsByAssessmentId(assessment.id);
      
      assessments.push({
        id: assessment.id,
        name: assessment.name,
        type: assessment.type,
        totalMarks: assessment.total_marks,
        date: assessment.date,
        questions: questions
      });
    }
    
    return assessments;
    */
    
    // For now, return mock data
    return mockAssessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw error;
  }
};

export const fetchAssessmentById = async (id: string): Promise<Assessment | null> => {
  try {
    // This would be the actual implementation once the tables are created
    /*
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    const questions = await fetchQuestionsByAssessmentId(data.id);
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      totalMarks: data.total_marks,
      date: data.date,
      questions: questions
    };
    */
    
    // For now, return mock data
    const assessment = mockAssessments.find(a => a.id === id);
    return assessment || null;
  } catch (error) {
    console.error("Error fetching assessment by ID:", error);
    throw error;
  }
};

export const addAssessment = async (assessment: Omit<Assessment, 'id'>): Promise<Assessment> => {
  try {
    // This would be the actual implementation once the tables are created
    /*
    // First, insert the assessment
    const { data, error } = await supabase
      .from('assessments')
      .insert([{
        name: assessment.name,
        type: assessment.type,
        total_marks: assessment.totalMarks,
        date: assessment.date
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Then, insert the questions
    const questions: Question[] = [];
    
    for (const question of assessment.questions) {
      const { data: questionData, error: questionError } = await supabase
        .from('assessment_questions')
        .insert([{
          assessment_id: data.id,
          text: question.text,
          marks: question.marks,
          module_id: question.moduleId
        }])
        .select()
        .single();
      
      if (questionError) throw questionError;
      
      questions.push({
        id: questionData.id,
        text: questionData.text,
        marks: questionData.marks,
        moduleId: questionData.module_id
      });
    }
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      totalMarks: data.total_marks,
      date: data.date,
      questions: questions
    };
    */
    
    // For now, simulate adding an assessment to mock data
    const newId = `assessment-${Date.now()}`;
    const newAssessment = {
      id: newId,
      ...assessment
    };
    
    console.log("Added new assessment:", newAssessment);
    return newAssessment;
  } catch (error) {
    console.error("Error adding assessment:", error);
    throw error;
  }
};

export const updateAssessment = async (id: string, assessment: Partial<Assessment>): Promise<Assessment> => {
  try {
    // This would be the actual implementation once the tables are created
    /*
    const updateData: any = {};
    
    if (assessment.name) updateData.name = assessment.name;
    if (assessment.type) updateData.type = assessment.type;
    if (assessment.totalMarks) updateData.total_marks = assessment.totalMarks;
    if (assessment.date) updateData.date = assessment.date;
    
    const { data, error } = await supabase
      .from('assessments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update questions if provided
    let questions = await fetchQuestionsByAssessmentId(id);
    
    if (assessment.questions) {
      // Delete existing questions
      await supabase
        .from('assessment_questions')
        .delete()
        .eq('assessment_id', id);
      
      // Insert new questions
      questions = [];
      
      for (const question of assessment.questions) {
        const { data: questionData, error: questionError } = await supabase
          .from('assessment_questions')
          .insert([{
            assessment_id: id,
            text: question.text,
            marks: question.marks,
            module_id: question.moduleId
          }])
          .select()
          .single();
        
        if (questionError) throw questionError;
        
        questions.push({
          id: questionData.id,
          text: questionData.text,
          marks: questionData.marks,
          moduleId: questionData.module_id
        });
      }
    }
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      totalMarks: data.total_marks,
      date: data.date,
      questions: questions
    };
    */
    
    // For now, simulate updating an assessment in mock data
    const existingAssessment = await fetchAssessmentById(id);
    
    if (!existingAssessment) {
      throw new Error("Assessment not found");
    }
    
    const updatedAssessment = {
      ...existingAssessment,
      ...assessment
    };
    
    console.log("Updated assessment:", updatedAssessment);
    return updatedAssessment;
  } catch (error) {
    console.error("Error updating assessment:", error);
    throw error;
  }
};

export const deleteAssessment = async (id: string): Promise<void> => {
  try {
    // This would be the actual implementation once the tables are created
    /*
    // Delete questions first due to foreign key constraint
    await supabase
      .from('assessment_questions')
      .delete()
      .eq('assessment_id', id);
    
    // Then delete the assessment
    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    */
    
    // For now, simulate deleting an assessment
    console.log(`Deleted assessment with ID: ${id}`);
  } catch (error) {
    console.error("Error deleting assessment:", error);
    throw error;
  }
};

// Helper function to fetch questions by assessment ID
const fetchQuestionsByAssessmentId = async (assessmentId: string): Promise<Question[]> => {
  try {
    // This would be the actual implementation once the tables are created
    /*
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId);
    
    if (error) throw error;
    
    return data.map(question => ({
      id: question.id,
      text: question.text,
      marks: question.marks,
      moduleId: question.module_id
    }));
    */
    
    // For now, return mock questions for the given assessment
    const assessment = mockAssessments.find(a => a.id === assessmentId);
    return assessment ? assessment.questions : [];
  } catch (error) {
    console.error("Error fetching questions by assessment ID:", error);
    throw error;
  }
};
