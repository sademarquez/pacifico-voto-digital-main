import { supabase } from "@/integrations/supabase/client";

export const getProjects = async () => {
  const { data, error } = await supabase.from("projects").select();
  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
  return data;
};

export const getMessageRecipients = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, role")
    .in("role", ["lider", "candidato"]);
  if (error) {
    console.error("Error fetching message recipients:", error);
    return [];
  }
  return data;
};

export const getVoterGoals = async () => {
  const { data, error } = await supabase.from("voter_goals").select();
  if (error) {
    console.error("Error fetching voter goals:", error);
    return [];
  }
  return data;
};

export const getUpcomingEvents = async () => {
  const { data, error } = await supabase.from("upcoming_events").select();
  if (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
  return data;
};

export const getAchievements = async () => {
  const { data, error } = await supabase.from("achievements").select();
  if (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
  return data;
};

export const getMasterData = async () => {
  const { data, error } = await supabase.from("masters").select();
  if (error) {
    console.error("Error fetching master data:", error);
    return [];
  }
  return data;
};

export const getCandidateData = async () => {
  const { data, error } = await supabase.from("candidates").select();
  if (error) {
    console.error("Error fetching candidate data:", error);
    return [];
  }
  return data;
};

export const getLeaderData = async () => {
  const { data, error } = await supabase.from("leaders").select();
  if (error) {
    console.error("Error fetching leader data:", error);
    return [];
  }
  return data;
};

export const getVoterData = async () => {
  const { data, error } = await supabase.from("voters").select();
  if (error) {
    console.error("Error fetching voter data:", error);
    return [];
  }
  return data;
};
