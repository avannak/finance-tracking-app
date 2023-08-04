import Icon from "@/components/icon/Icon";
import React, { useState } from "react";

type Goal = {
  id: string;
  label: string;
  icon: string; // URL or path to the image
};

type Props = {
  goals: Goal[];
  onSelectGoal: (goal: Goal) => void;
  className?: string;
};

const GoalSelection: React.FC<Props> = ({ goals, onSelectGoal, className }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    onSelectGoal(goal);
  };

  return (
    <div className={className}>
      {goals.map((goal) => (
        <button
          key={goal.id}
          className={`m-2 p-4 border-2 rounded-lg w-48 flex flex-col items-center ${
            selectedGoal?.id === goal.id ? "border-blue-500" : "border-white"
          }`}
          onClick={() => handleSelectGoal(goal)}
        >
          <Icon name={goal.icon} className="h-16 w-16 mb-2" />
          <span className="text-gray-100">{goal.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GoalSelection;
