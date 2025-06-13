import React, { useState, type FormEvent } from "react";
import { Eye, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../controller/ProjectController";

export const ProjectPage: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // BONUS: Industry-level validation state for error messages
  const [errors, setErrors] = useState<{ name?: string; description?: string }>(
    {}
  );
  const navigate = useNavigate();

  /**
   * Field-level validation
   */
  const validateFields = () => {
    const newErrors: { name?: string; description?: string } = {};
    if (!projectName.trim()) {
      newErrors.name = "Project name is required.";
    }
    if (!projectDescription.trim()) {
      newErrors.description = "Project description is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Field blur handler for live validation
   */
  const handleBlur = () => {
    validateFields();
  };

  /**
   * Submits the form to create the project
   *
   * @param event The form event
   */
  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    /**
     * TODO:
     * Complete the method by calling the `createProject() method in ProjectController.ts`
     * After creating project, verify that the server response is 200 before alerting the user and redirecting to the '/project-details' page
     *
     * BONUS - Add simple validation to the form inputs to not allow empty string and display an error alert
     */
    // alert("Successfully created project");
    // navigate('/project-details');

    event.preventDefault();

    // BONUS validation before submit
    if (!validateFields()) {
      alert("Please fix validation errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      const newProject = await createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
      });
      if (newProject && newProject.id) {
        alert("Successfully created project");
        navigate("/project-details");
      }
    } catch (error) {
      alert("Error creating project." + error);
    } finally {
      setLoading(false); // Reset loading state always
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Centered Content Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          {/* Project Creation Form */}
          <form onSubmit={onSubmit}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold">
                Begin your Project Journey
              </h1>
            </div>

            <div className="space-y-4">
              {/* Loading indicator */}
              {loading && (
                <div className="w-full text-center py-2 text-purple-600 font-medium">
                  Creating project...
                </div>
              )}

              {/* Project Name */}
              <div className="bg-gray-100 rounded-md p-3 flex items-center justify-between">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    className={`bg-transparent w-full border-none focus:outline-none ${
                      errors.name ? "ring-2 ring-red-400" : ""
                    }`}
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (errors.name)
                        setErrors({ ...errors, name: undefined });
                    }}
                    onBlur={handleBlur}
                    disabled={loading}
                    aria-invalid={!!errors.name}
                    aria-describedby={
                      errors.name ? "project-name-error" : undefined
                    }
                  />
                  {/* Inline error message */}
                  {errors.name && (
                    <span
                      className="text-xs text-red-500"
                      id="project-name-error"
                    >
                      {errors.name}
                    </span>
                  )}
                </div>
                <Eye className="h-5 w-5 text-gray-500" />
              </div>

              {/* Project Description */}
              <div className="bg-gray-100 rounded-md p-3 flex items-start justify-between">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <textarea
                    rows={3}
                    className={`bg-transparent w-full border-none focus:outline-none ${
                      errors.description ? "ring-2 ring-red-400" : ""
                    }`}
                    value={projectDescription}
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                      if (errors.description)
                        setErrors({ ...errors, description: undefined });
                    }}
                    onBlur={handleBlur}
                    disabled={loading}
                    aria-invalid={!!errors.description}
                    aria-describedby={
                      errors.description
                        ? "project-description-error"
                        : undefined
                    }
                  />
                  {/* Inline error message */}
                  {errors.description && (
                    <span
                      className="text-xs text-red-500"
                      id="project-description-error"
                    >
                      {errors.description}
                    </span>
                  )}
                </div>
                <FileText className="h-5 w-5 text-gray-500 mt-1" />
              </div>

              {/* Create Project Button */}
              <input
                className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
                type="submit"
                value={loading ? "Creating..." : "Create Project"}
                disabled={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
