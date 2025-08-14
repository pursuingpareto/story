import { useState, useEffect } from 'react'
import './App.css'

// Variable types and their configurations
const VARIABLE_TYPES = {
  SCALE: 'scale',
  COUNT: 'count', 
  PROGRESSION: 'progression'
};

// Story data structure
const initialStory = {
  "start": {
    id: "start",
    text: "You find yourself standing at the entrance of a mysterious cave. The air is thick with anticipation, and you can hear distant sounds echoing from within. Two paths lie before you, each leading deeper into the darkness.",
    options: [
      { text: "Take the left path", nextId: "left-path" },
      { text: "Take the right path", nextId: "right-path" },
      { text: "Examine the cave entrance more closely", nextId: "examine" }
    ]
  },
  "left-path": {
    id: "left-path",
    text: "The left path leads you into a chamber filled with ancient runes carved into the walls. The air is warmer here, and you notice a faint glow emanating from deeper within.",
    options: [
      { text: "Study the runes", nextId: "study-runes" },
      { text: "Follow the glow", nextId: "follow-glow" },
      { text: "Go back to the entrance", nextId: "start" }
    ]
  },
  "right-path": {
    id: "right-path",
    text: "The right path opens into a vast cavern with a crystal-clear underground lake. The water reflects light from above, creating a mesmerizing display of colors on the cave walls.",
    options: [
      { text: "Swim across the lake", nextId: "swim-lake" },
      { text: "Walk around the lake", nextId: "walk-around" },
      { text: "Go back to the entrance", nextId: "start" }
    ]
  },
  "examine": {
    id: "examine",
    text: "Looking more closely at the cave entrance, you discover a hidden inscription that reads 'Only the brave shall find the treasure within.' You also notice a small alcove that might contain something useful.",
    options: [
      { text: "Search the alcove", nextId: "search-alcove" },
      { text: "Take the left path", nextId: "left-path" },
      { text: "Take the right path", nextId: "right-path" }
    ]
  },
  "study-runes": {
    id: "study-runes",
    text: "As you study the runes, they begin to glow with an otherworldly light. The ancient text reveals a prophecy about a chosen one who will restore balance to the world. You feel a strange power coursing through your veins.",
    options: [
      { text: "Accept the power", nextId: "accept-power" },
      { text: "Reject the power", nextId: "reject-power" },
      { text: "Continue deeper", nextId: "follow-glow" }
    ]
  },
  "follow-glow": {
    id: "follow-glow",
    text: "Following the glow, you discover a chamber filled with precious gems and ancient artifacts. At the center stands a pedestal with a mysterious orb that pulses with energy.",
    options: [
      { text: "Take the orb", nextId: "take-orb" },
      { text: "Examine the artifacts", nextId: "examine-artifacts" },
      { text: "Leave everything as is", nextId: "leave-chamber" }
    ]
  },
  "swim-lake": {
    id: "swim-lake",
    text: "The water is surprisingly warm and inviting. As you swim, you notice the lake is much deeper than it appears. Suddenly, you see something large moving beneath the surface.",
    options: [
      { text: "Dive deeper to investigate", nextId: "dive-deeper" },
      { text: "Swim faster to the other side", nextId: "swim-fast" },
      { text: "Return to shore", nextId: "right-path" }
    ]
  },
  "walk-around": {
    id: "walk-around",
    text: "Walking around the lake, you discover a hidden passage behind a waterfall. The sound of rushing water masks any other sounds, but you can see light coming from within the passage.",
    options: [
      { text: "Enter the passage", nextId: "waterfall-passage" },
      { text: "Continue around the lake", nextId: "continue-around" },
      { text: "Return to the lake", nextId: "right-path" }
    ]
  },
  "search-alcove": {
    id: "search-alcove",
    text: "In the alcove, you find an old leather satchel containing a map, a compass, and a small vial of glowing liquid. The map shows the layout of the cave system, but some areas are marked with warnings.",
    options: [
      { text: "Use the map to navigate", nextId: "use-map" },
      { text: "Drink the glowing liquid", nextId: "drink-liquid" },
      { text: "Take the satchel and continue", nextId: "take-satchel" }
    ]
  },
  "accept-power": {
    id: "accept-power",
    text: "As you accept the power, the runes flare brightly and you feel incredible energy flowing through you. You now understand the ancient language and can sense the presence of other magical beings in the cave.",
    options: [
      { text: "Use your new powers to explore", nextId: "use-powers" },
      { text: "Seek out the other magical beings", nextId: "seek-beings" },
      { text: "Continue to the treasure chamber", nextId: "follow-glow" }
    ]
  },
  "reject-power": {
    id: "reject-power",
    text: "You choose to reject the power, and the runes fade back to their dormant state. You feel a sense of peace and clarity, knowing that some things are better left untouched.",
    options: [
      { text: "Continue exploring without power", nextId: "follow-glow" },
      { text: "Return to the entrance", nextId: "start" },
      { text: "Search for another way", nextId: "search-alcove" }
    ]
  },
  "take-orb": {
    id: "take-orb",
    text: "As you grasp the orb, it begins to float above your hand and projects images of the cave's history. You see ancient civilizations, great battles, and the creation of this very chamber. The orb chooses you as its guardian.",
    options: [
      { text: "Accept guardianship", nextId: "accept-guardianship" },
      { text: "Return the orb", nextId: "return-orb" },
      { text: "Use the orb's power", nextId: "use-orb-power" }
    ]
  },
  "examine-artifacts": {
    id: "examine-artifacts",
    text: "The artifacts tell a story of a great civilization that once thrived here. You find scrolls, weapons, and jewelry, each with its own history. One particular scroll seems to contain a spell or ritual.",
    options: [
      { text: "Read the scroll", nextId: "read-scroll" },
      { text: "Take some artifacts", nextId: "take-artifacts" },
      { text: "Leave everything undisturbed", nextId: "leave-chamber" }
    ]
  },
  "leave-chamber": {
    id: "leave-chamber",
    text: "You choose to leave the chamber untouched, respecting the ancient site. As you exit, you feel a sense of accomplishment for having discovered this place without disturbing its treasures.",
    options: [
      { text: "Return to the entrance", nextId: "start" },
      { text: "Explore other areas", nextId: "left-path" },
      { text: "End your adventure", nextId: "end" }
    ]
  },
  "end": {
    id: "end",
    text: "",
    options: [
      { text: "Start a new adventure", nextId: "start" }
    ]
  },
  "dive-deeper": {
    id: "dive-deeper",
    text: "",
    options: []
  },
  "swim-fast": {
    id: "swim-fast",
    text: "",
    options: []
  },
  "waterfall-passage": {
    id: "waterfall-passage",
    text: "",
    options: []
  },
  "continue-around": {
    id: "continue-around",
    text: "",
    options: []
  },
  "use-map": {
    id: "use-map",
    text: "",
    options: []
  },
  "drink-liquid": {
    id: "drink-liquid",
    text: "",
    options: []
  },
  "take-satchel": {
    id: "take-satchel",
    text: "",
    options: []
  },
  "use-powers": {
    id: "use-powers",
    text: "",
    options: []
  },
  "seek-beings": {
    id: "seek-beings",
    text: "",
    options: []
  },
  "accept-guardianship": {
    id: "accept-guardianship",
    text: "",
    options: []
  },
  "return-orb": {
    id: "return-orb",
    text: "",
    options: []
  },
  "use-orb-power": {
    id: "use-orb-power",
    text: "",
    options: []
  },
  "read-scroll": {
    id: "read-scroll",
    text: "",
    options: []
  },
  "take-artifacts": {
    id: "take-artifacts",
    text: "",
    options: []
  }
};

// Initial variables state
const initialVariables = {
  "light-level": {
    id: "light-level",
    name: "Light Level",
    type: VARIABLE_TYPES.SCALE,
    value: 50,
    min: 0,
    max: 100,
    minLabel: "Dark",
    maxLabel: "Blinding Bright",
    description: "Current light level in the environment"
  },
  "fish-count": {
    id: "fish-count", 
    name: "Fish",
    type: VARIABLE_TYPES.COUNT,
    value: 0,
    description: "Number of fish collected"
  },
  "realization": {
    id: "realization",
    name: "Realization",
    type: VARIABLE_TYPES.PROGRESSION,
    value: 0,
    stages: [
      "Unsure",
      "Suspecting", 
      "Slowly Understanding",
      "Cusp of Realization",
      "Revelation"
    ],
    description: "Level of understanding about the mystery"
  }
};

function App() {
  const [story, setStory] = useState(initialStory);
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [history, setHistory] = useState([]);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [isAddingNewOption, setIsAddingNewOption] = useState(false);
  const [newOptionText, setNewOptionText] = useState("");
  const [isLinkingChoice, setIsLinkingChoice] = useState(false);
  const [linkingChoiceIndex, setLinkingChoiceIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [nextNodeId, setNextNodeId] = useState(1);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // New state for variables system
  const [variables, setVariables] = useState(initialVariables);
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const [showCreateVariable, setShowCreateVariable] = useState(false);
  const [editingVariable, setEditingVariable] = useState(null);
  const [newVariable, setNewVariable] = useState({
    name: "",
    type: VARIABLE_TYPES.SCALE,
    value: 0,
    min: 0,
    max: 100,
    minLabel: "",
    maxLabel: "",
    stages: [],
    description: ""
  });

  const currentNode = story[currentNodeId];

  // Helper function to generate next unique node ID
  const generateNextNodeId = () => {
    const newId = nextNodeId;
    setNextNodeId(prev => prev + 1);
    return `node-${newId}`;
  };

  // Helper function to create a new node and link it
  const createNewNodeAndLink = (optionText, targetNodeId = null) => {
    const newOptionId = generateNextNodeId();
    const newOption = { text: optionText.trim(), nextId: newOptionId };

    // Create new empty node
    const newNode = {
      id: newOptionId,
      text: "",
      options: [],
      color: "#000000"
    };

    // Add option to current node
    const updatedOptions = [...currentNode.options, newOption];

    setStory(prev => ({
      ...prev,
      [currentNodeId]: {
        ...prev[currentNodeId],
        options: updatedOptions
      },
      [newOptionId]: newNode
    }));

    return newOptionId;
  };

  // Helper function to update an existing option's link
  const updateOptionLink = (optionIndex, targetNodeId) => {
    const updatedOptions = [...currentNode.options];
    updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], nextId: targetNodeId };

    setStory(prev => ({
      ...prev,
      [currentNodeId]: {
        ...prev[currentNodeId],
        options: updatedOptions
      }
    }));
  };

  // Shared component for linking choices
  const LinkChoiceInterface = ({ choiceText, onCancel, onLinkToExisting, onCreateNew, currentLinkId = null }) => (
    <div className="link-choice-interface">
      <div style={{ marginBottom: '8px', color: getTextColor(currentNode.color) }}>
        <strong>Link "{choiceText}" to:</strong>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={onCreateNew}
          style={{
            color: getTextColor(currentNode.color),
            background: 'rgba(255, 255, 255, 0.2)',
            border: `1px solid ${getTextColor(currentNode.color)}`,
            padding: '8px'
          }}
        >
          ➕ Create New Node
        </button>
        {existingNodes.map(nodeId => (
          <button
            key={nodeId}
            onClick={() => onLinkToExisting(nodeId)}
            style={{
              color: getTextColor(story[nodeId]?.color),
              background: story[nodeId]?.color ? `linear-gradient(135deg, ${story[nodeId].color} 0%, ${adjustColor(story[nodeId].color, 20)} 100%)` : 'rgba(255, 255, 255, 0.2)',
              border: `2px solid ${getTextColor(story[nodeId]?.color)}`,
              outline: currentLinkId === nodeId ? `4px solid ${getTextColor(currentNode.color)}` : 'none',
              padding: '8px',
              textAlign: 'left',
              minWidth: '120px'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>
              {story[nodeId]?.text ? 
                (() => {
                  const firstLine = story[nodeId].text.split('\n')[0];
                  return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
                })() : 
                "Untitled"
              }
            </div>
            <div style={{ fontSize: '0.8em', opacity: 0.8 }}>
              {nodeId}
            </div>
          </button>
        ))}
        <button
          onClick={onCancel}
          style={{
            color: getTextColor(currentNode.color),
            background: 'rgba(255, 255, 255, 0.2)',
            border: `1px solid ${getTextColor(currentNode.color)}`,
            padding: '8px'
          }}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  );

  // Auto-resize textarea
  const adjustHeight = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 2 +'px';
  };

  // Auto-resize when story content changes (navigation between nodes)
  useEffect(() => {
    const textarea = document.querySelector('.story-text');
    if (textarea) {
      adjustHeight(textarea);
    }
  }, [currentNode.text]);

  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Helper function to calculate text color based on background brightness
  const getTextColor = (backgroundColor) => {
    if (!backgroundColor) return '#f8f8f8'; // Default light text

    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return dark text for light backgrounds, light text for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  useEffect(() => {
    // Only save to localStorage after initial load is complete
    if (isInitialized) {
      const appState = {
        story: story,
        currentNodeId: currentNodeId,
        history: history,
        nextNodeId: nextNodeId,
        variables: variables
      };
      localStorage.setItem('adventure-app-state', JSON.stringify(appState));
      console.log('Saved to localStorage');
    }
  }, [story, currentNodeId, history, nextNodeId, variables, isInitialized]);

  useEffect(() => {
    // Load complete app state from localStorage on component mount
    const savedState = localStorage.getItem('adventure-app-state');
    console.log('Loading from localStorage');
    if (savedState) {
      try {
        const appState = JSON.parse(savedState);
        console.log('Parsed app state:', appState);
        setStory(appState.story);
        setCurrentNodeId(appState.currentNodeId || "start");
        setHistory(appState.history || []);
        setNextNodeId(appState.nextNodeId || 1);
        setVariables(appState.variables || initialVariables);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
      }
    } else {
      console.log('No saved state found in localStorage');
    }
    
    // Mark as initialized after load attempt
    setIsInitialized(true);
  }, []);


  // File save functionality
  const saveStoryToFile = () => {
    const storyData = {
      story: story,
      currentNodeId: currentNodeId,
      history: history,
      nextNodeId: nextNodeId,
      variables: variables,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(storyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adventure-story-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadStoryFromFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const storyData = JSON.parse(e.target.result);
          if (storyData.story) {
            setStory(storyData.story);
            if (storyData.currentNodeId) {
              setCurrentNodeId(storyData.currentNodeId);
            }
            if (storyData.history) {
              setHistory(storyData.history);
            }
            if (storyData.nextNodeId) {
              setNextNodeId(storyData.nextNodeId);
            }
            if (storyData.variables) {
              setVariables(storyData.variables);
            }
            alert('Story loaded successfully!');
          } else {
            alert('Invalid story file format.');
          }
        } catch (error) {
          alert('Error loading story file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  function handleChoice(option) {
    setHistory(prev => [...prev, { nodeId: currentNodeId }]);
    setCurrentNodeId(option.nextId);
  }

  function startEditOption(index) {
    setEditingOptionIndex(index);
    setEditText(currentNode.options[index].text);
  }

  function saveEditOption() {
    if (editingOptionIndex !== null) {
      const updatedOptions = [...currentNode.options];
      updatedOptions[editingOptionIndex] = { ...updatedOptions[editingOptionIndex], text: editText };

      setStory(prev => ({
        ...prev,
        [currentNodeId]: {
          ...prev[currentNodeId],
          options: updatedOptions
        }
      }));
      
      setEditingOptionIndex(null);
      setEditText("");
    }
  }

  function cancelEditOption() {
    setEditingOptionIndex(null);
    setEditText("");
  }

  function startLinkChoice(index) {
    setIsLinkingChoice(true);
    setLinkingChoiceIndex(index);
  }

  function linkToExistingNode(targetNodeId) {
    if (linkingChoiceIndex !== null) {
      // Update existing choice
      updateOptionLink(linkingChoiceIndex, targetNodeId);
    } else {
      // Add new choice
      const newOption = { text: newOptionText.trim(), nextId: targetNodeId };
      const updatedOptions = [...currentNode.options, newOption];

      setStory(prev => ({
        ...prev,
        [currentNodeId]: {
          ...prev[currentNodeId],
          options: updatedOptions
        }
      }));

      setIsAddingNewOption(false);
      setNewOptionText("");
    }

    setIsLinkingChoice(false);
    setLinkingChoiceIndex(null);
  }

  function cancelLinkChoice() {
    setIsLinkingChoice(false);
    setLinkingChoiceIndex(null);
  }

  function toggleDropdown(index) {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  }

  function closeDropdown() {
    setOpenDropdownIndex(null);
  }

  function toggleSettingsMenu() {
    setShowSettingsMenu(!showSettingsMenu);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close choice dropdowns
      if (openDropdownIndex !== null) {
        const dropdowns = document.querySelectorAll('.choice-actions');
        let clickedInside = false;
        dropdowns.forEach(dropdown => {
          if (dropdown.contains(event.target)) {
            clickedInside = true;
          }
        });
        if (!clickedInside) {
          closeDropdown();
        }
      }
      
      // Close settings menu
      if (showSettingsMenu) {
        const settingsMenu = document.querySelector('.settings-menu');
        if (settingsMenu && !settingsMenu.contains(event.target)) {
          setShowSettingsMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdownIndex, showSettingsMenu]);

  function deleteOption(index) {
    const confirmed = confirm(`Are you sure you want to delete the choice "${currentNode.options[index].text}"?`);
    if (confirmed) {
      const updatedOptions = currentNode.options.filter((_, i) => i !== index);
      setStory(prev => ({
        ...prev,
        [currentNodeId]: {
          ...prev[currentNodeId],
          options: updatedOptions
        }
      }));
    }
  }

  function startAddNewOption() {
    setIsAddingNewOption(true);
    setNewOptionText("");
  }

  function saveNewOption() {
    if (newOptionText.trim()) {
      createNewNodeAndLink(newOptionText);
      setIsAddingNewOption(false);
      setNewOptionText("");
    }
  }

  function cancelAddNewOption() {
    setIsAddingNewOption(false);
    setNewOptionText("");
  }

  function goBack() {
    if (history.length > 0) {
      const newHistory = [...history];
      const lastEntry = newHistory.pop();
      setHistory(newHistory);
      setCurrentNodeId(lastEntry.nodeId);
    }
  }

  function resetStory() {
    const hasUnsavedChanges = JSON.stringify(story) !== JSON.stringify(initialStory);
    
    if (hasUnsavedChanges) {
      const confirmed = confirm(
        "⚠️ Warning: This will replace your current story with the default story.\n\n" +
        "Your current story will be lost unless you save it first.\n\n" +
        "Do you want to continue? (Consider saving your story first!)"
      );
      
      if (!confirmed) {
        return;
      }
    }
    
    setStory({
      "start": {
        id: "start",
        text: "",
        options: [],
        color: "#000000",
      }
    });
    setCurrentNodeId("start");
    setHistory([]);
    setNextNodeId(1);
    setVariables(initialVariables);
  }

  // Helper function to prune orphaned empty nodes
  const pruneOrphanedNodes = () => {
    // Find all nodes that are reachable from the start node
    const reachableNodes = new Set();
    const visited = new Set();
    
    const traverse = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      reachableNodes.add(nodeId);
      
      const node = story[nodeId];
      if (node && node.options) {
        node.options.forEach(option => {
          if (option.nextId) {
            traverse(option.nextId);
          }
        });
      }
    };
    
    // Start traversal from the start node
    traverse("start");
    
    // Find orphaned nodes (nodes that are not reachable)
    const orphanedNodes = Object.keys(story).filter(nodeId => !reachableNodes.has(nodeId));
    
    if (orphanedNodes.length === 0) {
      alert("No orphaned nodes found!");
      return;
    }
    
    const confirmed = confirm(
      `Found ${orphanedNodes.length} orphaned node(s):\n${orphanedNodes.join(', ')}\n\nDo you want to remove them?`
    );
    
    if (confirmed) {
      const cleanedStory = { ...story };
      orphanedNodes.forEach(nodeId => {
        delete cleanedStory[nodeId];
      });
      
      setStory(cleanedStory);
      alert(`Removed ${orphanedNodes.length} orphaned node(s)!`);
    }
  };

  // Variable management functions
  const createVariable = () => {
    if (!newVariable.name.trim()) {
      alert("Please enter a variable name");
      return;
    }

    const variableId = newVariable.name.toLowerCase().replace(/\s+/g, '-');
    
    if (variables[variableId]) {
      alert("A variable with this name already exists");
      return;
    }

    const variable = {
      id: variableId,
      name: newVariable.name.trim(),
      type: newVariable.type,
      value: newVariable.value,
      description: newVariable.description.trim()
    };

    // Add type-specific properties
    if (newVariable.type === VARIABLE_TYPES.SCALE) {
      variable.min = newVariable.min;
      variable.max = newVariable.max;
      variable.minLabel = newVariable.minLabel.trim();
      variable.maxLabel = newVariable.maxLabel.trim();
    } else if (newVariable.type === VARIABLE_TYPES.PROGRESSION) {
      variable.stages = newVariable.stages.filter(stage => stage.trim());
      if (variable.stages.length === 0) {
        alert("Please add at least one stage for progression variables");
        return;
      }
    }

    setVariables(prev => ({
      ...prev,
      [variableId]: variable
    }));

    // Reset form
    setNewVariable({
      name: "",
      type: VARIABLE_TYPES.SCALE,
      value: 0,
      min: 0,
      max: 100,
      minLabel: "",
      maxLabel: "",
      stages: [],
      description: ""
    });
    setShowCreateVariable(false);
  };

  const updateVariable = (variableId, updates) => {
    setVariables(prev => ({
      ...prev,
      [variableId]: {
        ...prev[variableId],
        ...updates
      }
    }));
  };

  const deleteVariable = (variableId) => {
    const confirmed = confirm(`Are you sure you want to delete the variable "${variables[variableId].name}"?`);
    if (confirmed) {
      setVariables(prev => {
        const newVars = { ...prev };
        delete newVars[variableId];
        return newVars;
      });
    }
  };

  const addStage = () => {
    if (newVariable.stages.length < 10) { // Limit to 10 stages
      setNewVariable(prev => ({
        ...prev,
        stages: [...prev.stages, ""]
      }));
    }
  };

  const removeStage = (index) => {
    setNewVariable(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const updateStage = (index, value) => {
    setNewVariable(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => i === index ? value : stage)
    }));
  };

  // Get existing nodes for linking
  const existingNodes = Object.keys(story);

  return (
    <div
      className="adventure-container"
      style={{
        background: currentNode.color ? `linear-gradient(135deg, ${currentNode.color} 0%, ${adjustColor(currentNode.color, 20)} 100%)` : 'rgba(255, 255, 255, 0.1)',
        minHeight: '100vh',
        padding: '16px'
      }}
    >
      {/* Header with title and settings */}
      <div className="app-header">
        <h1 style={{ color: getTextColor(currentNode.color) }}>Choose Your Own Adventure</h1>
        <div className="header-actions" style={{ position: 'relative' }}>
          <button
            className="variables-button"
            onClick={() => setShowVariablesPanel(!showVariablesPanel)}
            style={{
              color: getTextColor(currentNode.color),
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${getTextColor(currentNode.color)}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              marginRight: '8px'
            }}
          >
            📊
          </button>
          <button
            className="settings-button"
            onClick={toggleSettingsMenu}
            style={{
              color: getTextColor(currentNode.color),
              background: 'rgba(255, 255, 255, 0.1)',
              border: `1px solid ${getTextColor(currentNode.color)}`,
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ⚙️
          </button>
          {showSettingsMenu && (
            <div className="settings-menu" style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              background: 'rgba(0, 0, 0, 0.95)',
              border: `1px solid ${getTextColor(currentNode.color)}`,
              borderRadius: '12px',
              padding: '12px',
              zIndex: 1000,
              minWidth: '200px',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="settings-section">
                <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '14px' }}>Story Management</h4>
                <button
                  className="settings-item"
                  onClick={() => {
                    saveStoryToFile();
                    setShowSettingsMenu(false);
                  }}
                  style={{
                    color: '#ffffff',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '6px'
                  }}
                >
                  💾 Save Story
                </button>
                <label className="settings-item" style={{
                  color: '#ffffff',
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 12px',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  borderRadius: '6px',
                  display: 'block'
                }}>
                  📁 Load Story
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      loadStoryFromFile(e);
                      setShowSettingsMenu(false);
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  className="settings-item"
                  onClick={() => {
                    resetStory();
                    setShowSettingsMenu(false);
                  }}
                  style={{
                    color: '#ffffff',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '6px'
                  }}
                >
                  🆕 New Story
                </button>
              </div>
              <div className="settings-section" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <h4 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '14px' }}>Tools</h4>
                <button
                  className="settings-item"
                  onClick={() => {
                    pruneOrphanedNodes();
                    setShowSettingsMenu(false);
                  }}
                  style={{
                    color: '#ffffff',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '6px'
                  }}
                >
                  🧹 Prune Orphaned Nodes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Variables Panel */}
      {showVariablesPanel && (
        <div className="variables-panel" style={{
          background: 'rgba(0, 0, 0, 0.9)',
          border: `1px solid ${getTextColor(currentNode.color)}`,
          borderRadius: '12px',
          padding: '16px',
          margin: '16px 0',
          color: '#ffffff'
        }}>
          <div className="variables-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#ffffff' }}>📊 Adventure Variables</h3>
            <button
              onClick={() => setShowCreateVariable(!showCreateVariable)}
              style={{
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid #ffffff',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showCreateVariable ? 'Cancel' : '+ Add Variable'}
            </button>
          </div>

          {/* Create Variable Form */}
          {showCreateVariable && (
            <div className="create-variable-form" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#ffffff' }}>Create New Variable</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Name:</label>
                  <input
                    type="text"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Variable name"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: '#ffffff',
                      color: '#000000'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Type:</label>
                  <select
                    value={newVariable.type}
                    onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      background: '#ffffff',
                      color: '#000000'
                    }}
                  >
                    <option value={VARIABLE_TYPES.SCALE}>Scale (0-100 with labels)</option>
                    <option value={VARIABLE_TYPES.COUNT}>Count (whole numbers)</option>
                    <option value={VARIABLE_TYPES.PROGRESSION}>Progression (stages)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Description:</label>
                <input
                  type="text"
                  value={newVariable.description}
                  onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this variable track?"
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#ffffff',
                    color: '#000000'
                  }}
                />
              </div>

              {/* Scale-specific fields */}
              {newVariable.type === VARIABLE_TYPES.SCALE && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Min Value:</label>
                    <input
                      type="number"
                      value={newVariable.min}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#ffffff',
                        color: '#000000'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Max Value:</label>
                    <input
                      type="number"
                      value={newVariable.max}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, max: parseInt(e.target.value) || 100 }))}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#ffffff',
                        color: '#000000'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Min Label:</label>
                    <input
                      type="text"
                      value={newVariable.minLabel}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, minLabel: e.target.value }))}
                      placeholder="e.g., Dark"
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#ffffff',
                        color: '#000000'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>Max Label:</label>
                    <input
                      type="text"
                      value={newVariable.maxLabel}
                      onChange={(e) => setNewVariable(prev => ({ ...prev, maxLabel: e.target.value }))}
                      placeholder="e.g., Bright"
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        background: '#ffffff',
                        color: '#000000'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Progression-specific fields */}
              {newVariable.type === VARIABLE_TYPES.PROGRESSION && (
                <div style={{ marginTop: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px' }}>
                    Stages ({newVariable.stages.length}/10):
                  </label>
                  {newVariable.stages.map((stage, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        value={stage}
                        onChange={(e) => updateStage(index, e.target.value)}
                        placeholder={`Stage ${index + 1}`}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          background: '#ffffff',
                          color: '#000000'
                        }}
                      />
                      <button
                        onClick={() => removeStage(index)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '4px',
                          border: '1px solid #ff6b6b',
                          background: '#ff6b6b',
                          color: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {newVariable.stages.length < 10 && (
                    <button
                      onClick={addStage}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '4px',
                        border: '1px solid #4CAF50',
                        background: '#4CAF50',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      + Add Stage
                    </button>
                  )}
                </div>
              )}

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button
                  onClick={createVariable}
                  disabled={!newVariable.name.trim()}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid #4CAF50',
                    background: '#4CAF50',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginLeft: '8px'
                  }}
                >
                  Create Variable
                </button>
              </div>
            </div>
          )}

          {/* Variables List */}
          <div className="variables-list">
            {Object.keys(variables).length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.7, fontStyle: 'italic' }}>
                No variables created yet. Create your first variable to start tracking your adventure!
              </p>
            ) : (
              Object.entries(variables).map(([variableId, variable]) => (
                <div key={variableId} className="variable-item" style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#ffffff' }}>{variable.name}</h4>
                      <p style={{ margin: '0', fontSize: '12px', opacity: 0.8 }}>{variable.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setEditingVariable(editingVariable === variableId ? null : variableId)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #FFD700',
                          background: '#FFD700',
                          color: '#000000',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteVariable(variableId)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #ff6b6b',
                          background: '#ff6b6b',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Variable Display */}
                  <div className="variable-display">
                    {variable.type === VARIABLE_TYPES.SCALE && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>{variable.minLabel}</span>
                          <span style={{ fontSize: '12px', opacity: 0.8 }}>{variable.maxLabel}</span>
                        </div>
                        <input
                          type="range"
                          min={variable.min}
                          max={variable.max}
                          value={variable.value}
                          onChange={(e) => updateVariable(variableId, { value: parseInt(e.target.value) })}
                          style={{ width: '100%' }}
                        />
                        <div style={{ textAlign: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{variable.value}</span>
                        </div>
                      </div>
                    )}

                    {variable.type === VARIABLE_TYPES.COUNT && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => updateVariable(variableId, { value: Math.max(0, variable.value - 1) })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ff6b6b',
                            background: '#ff6b6b',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', minWidth: '40px', textAlign: 'center' }}>
                          {variable.value}
                        </span>
                        <button
                          onClick={() => updateVariable(variableId, { value: variable.value + 1 })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '4px',
                            border: '1px solid #4CAF50',
                            background: '#4CAF50',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {variable.type === VARIABLE_TYPES.PROGRESSION && (
                      <div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          {variable.stages.map((stage, index) => (
                            <button
                              key={index}
                              onClick={() => updateVariable(variableId, { value: index })}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: `2px solid ${index === variable.value ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'}`,
                                background: index === variable.value ? '#4CAF50' : 'transparent',
                                color: index === variable.value ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                transition: 'all 0.2s'
                              }}
                            >
                              {stage}
                            </button>
                          ))}
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: '14px', opacity: 0.8 }}>
                            Current: {variable.stages[variable.value]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Edit Variable Form */}
                  {editingVariable === variableId && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      marginTop: '12px'
                    }}>
                      <h5 style={{ margin: '0 0 8px 0', color: '#ffffff' }}>Edit Variable</h5>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Name:</label>
                        <input
                          type="text"
                          value={variable.name}
                          onChange={(e) => updateVariable(variableId, { name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#ffffff',
                            color: '#000000',
                            fontSize: '12px'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Description:</label>
                        <input
                          type="text"
                          value={variable.description}
                          onChange={(e) => updateVariable(variableId, { description: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '6px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#ffffff',
                            color: '#000000',
                            fontSize: '12px'
                          }}
                        />
                      </div>

                      {variable.type === VARIABLE_TYPES.SCALE && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Min Label:</label>
                            <input
                              type="text"
                              value={variable.minLabel}
                              onChange={(e) => updateVariable(variableId, { minLabel: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '6px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                background: '#ffffff',
                                color: '#000000',
                                fontSize: '12px'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px' }}>Max Label:</label>
                            <input
                              type="text"
                              value={variable.maxLabel}
                              onChange={(e) => updateVariable(variableId, { maxLabel: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '6px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                background: '#ffffff',
                                color: '#000000',
                                fontSize: '12px'
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: '12px', textAlign: 'right' }}>
                        <button
                          onClick={() => setEditingVariable(null)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#ccc',
                            color: '#000000',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Breadcrumb navigation */}
      <div className="breadcrumbs" style={{
        color: getTextColor(currentNode.color), border: `1px solid ${getTextColor(currentNode.color)}`
      }}>
        {[...history, { nodeId: currentNodeId }].map((entry, idx) => {
          const node = story[entry.nodeId];
          const firstLine = node?.text ? node.text.split('\n')[0] : 'Untitled';
          const displayText = firstLine.length > 20 ? firstLine.substring(0, 20) + '...' : firstLine;
          const totalLength = history.length + 1;
          const isCurrentNode = idx === totalLength - 1;
          
          const handleBreadcrumbClick = () => {
            if (!isCurrentNode) {
              setCurrentNodeId(entry.nodeId);
              setHistory(history.slice(0, idx));
            }
          };
          
          return (
            <span key={idx}>
              <span 
                className={`breadcrumb-item ${!isCurrentNode ? 'breadcrumb-clickable' : ''}`}
                onClick={handleBreadcrumbClick}
                style={{ 
                  cursor: !isCurrentNode ? 'pointer' : 'default',
                  background: story[entry.nodeId]?.color ? `linear-gradient(135deg, ${story[entry.nodeId].color} 0%, ${adjustColor(story[entry.nodeId].color, 20)} 100%)` : 'rgba(255, 255, 255, 0.1)',
                  color: getTextColor(story[entry.nodeId]?.color),
                  padding: '4px 8px',
                  borderRadius: '4px',
                  margin: '0 2px'
                }}
              >
                {displayText}
              </span>
              {idx < totalLength - 1 && ' > '}
            </span>
          );
        })}
      </div>

      {/* Story content */}
      <textarea
        className="story-text"
        value={currentNode.text || ""}
        placeholder="This part of the story hasn't been written yet."
        onChange={(e) => {
          const newText = e.target.value;
          if (newText !== currentNode.text) {
            setStory(prev => ({
              ...prev,
              [currentNodeId]: {
                ...prev[currentNodeId],
                text: newText
              }
            }));
          }
        }}
        onInput={(e) => adjustHeight(e.target)}
        style={{
          color: getTextColor(currentNode.color),
          background: 'rgba(255, 255, 255, 0.1)',
          border: `1px solid ${getTextColor(currentNode.color)}`,
          outline: 'none',
          resize: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          flexShrink: 0, // Prevent flex container from shrinking this element
          width: '100%',
        }}
      />

      {/* Choice buttons */}
      <div className="choice-buttons">
        {currentNode.options && currentNode.options.length > 0 ? (
          currentNode.options.map((option, index) => (
            <div key={index} className="choice-item">
              {editingOptionIndex === index ? (
                <div className="edit-option-inline">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEditOption();
                      }
                    }}
                    style={{
                      color: getTextColor(currentNode.color),
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: `2px solid ${getTextColor(currentNode.color)}`,
                      padding: '8px',
                      marginRight: '8px',
                      flex: 1,
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={saveEditOption}
                    style={{
                      color: getTextColor(currentNode.color),
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: `1px solid ${getTextColor(currentNode.color)}`,
                      marginRight: '4px'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditOption}
                    style={{
                      color: getTextColor(currentNode.color),
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: `1px solid ${getTextColor(currentNode.color)}`
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : isLinkingChoice && linkingChoiceIndex === index ? (
                <div className="link-choice-inline">
                                     <LinkChoiceInterface
                   choiceText={option.text}
                   onCancel={cancelLinkChoice}
                   onLinkToExisting={linkToExistingNode}
                   onCreateNew={() => {
                     // Remove the existing option and add a new one with the same text
                     const updatedOptions = [...currentNode.options];
                     updatedOptions.splice(index, 1);
                     
                     // Create new node and add the option
                     createNewNodeAndLink(option.text);
                     
                     setIsLinkingChoice(false);
                     setLinkingChoiceIndex(null);
                   }}
                   currentLinkId={option.nextId}
                 />
                </div>
              ) : (
                <>
                  <div className="choice-with-actions">
                    <button
                      className="choice-button"
                      onClick={() => handleChoice(option)}
                      style={{
                        color: getTextColor(currentNode.color),
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: `2px solid ${getTextColor(currentNode.color)}`
                      }}
                    >
                      {option.text}
                    </button>
                    <div className="choice-actions">
                      <button
                        className="edit-icon-button"
                        onClick={() => toggleDropdown(index)}
                        style={{
                          color: getTextColor(currentNode.color),
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: `1px solid ${getTextColor(currentNode.color)}`,
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        ✏️
                      </button>
                      {openDropdownIndex === index && (
                        <div className="dropdown-menu" style={{
                          position: 'absolute',
                          top: '100%',
                          right: '0',
                          background: 'rgba(0, 0, 0, 0.9)',
                          border: `1px solid ${getTextColor(currentNode.color)}`,
                          borderRadius: '8px',
                          padding: '4px',
                          zIndex: 1000,
                          minWidth: '120px'
                        }}>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              startEditOption(index);
                              closeDropdown();
                            }}
                            style={{
                              color: '#ffffff',
                              background: 'transparent',
                              border: 'none',
                              padding: '8px 12px',
                              width: '100%',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              startLinkChoice(index);
                              closeDropdown();
                            }}
                            style={{
                              color: '#ffffff',
                              background: 'transparent',
                              border: 'none',
                              padding: '8px 12px',
                              width: '100%',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            🔗 Link
                          </button>
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              deleteOption(index);
                              closeDropdown();
                            }}
                            style={{
                              color: '#ff6b6b',
                              background: 'transparent',
                              border: 'none',
                              padding: '8px 12px',
                              width: '100%',
                              textAlign: 'left',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-options" style={{ color: getTextColor(currentNode.color) }}>No choices available at this point.</p>
        )}

        {/* Add new option section */}
        {isAddingNewOption ? (
          <div className="add-option-inline">
            {isLinkingChoice && linkingChoiceIndex === null ? (
              <LinkChoiceInterface
                choiceText={newOptionText}
                onCancel={cancelAddNewOption}
                onLinkToExisting={linkToExistingNode}
                onCreateNew={() => {
                  createNewNodeAndLink(newOptionText);
                  setIsAddingNewOption(false);
                  setNewOptionText("");
                  setIsLinkingChoice(false);
                }}
              />
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter new choice text..."
                  value={newOptionText}
                  onChange={(e) => setNewOptionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveNewOption();
                    }
                  }}
                  style={{
                    color: getTextColor(currentNode.color),
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `2px solid ${getTextColor(currentNode.color)}`,
                    padding: '8px',
                    marginRight: '8px',
                    flex: 1,
                    outline: 'none',
                  }}
                />
                <button
                  onClick={saveNewOption}
                  disabled={!newOptionText.trim()}
                  style={{
                    color: getTextColor(currentNode.color),
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: `1px solid ${getTextColor(currentNode.color)}`,
                    marginRight: '4px'
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    if (newOptionText.trim()) {
                      setIsLinkingChoice(true);
                      setLinkingChoiceIndex(null);
                    }
                  }}
                  disabled={!newOptionText.trim()}
                  style={{
                    color: getTextColor(currentNode.color),
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: `1px solid ${getTextColor(currentNode.color)}`,
                    marginRight: '4px'
                  }}
                >
                  Link
                </button>
                <button
                  onClick={cancelAddNewOption}
                  style={{
                    color: getTextColor(currentNode.color),
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: `1px solid ${getTextColor(currentNode.color)}`
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ) : (
          <button
            className="add-option-button"
            onClick={startAddNewOption}
            style={{
              color: getTextColor(currentNode.color),
              borderColor: getTextColor(currentNode.color)
            }}
          >
            Add New Choice
          </button>
        )}
      </div>

      {/* Color picker section */}
      <div className="color-picker-section" style={{
        border: `1px solid ${getTextColor(currentNode.color)}`
      }}>
        <label htmlFor="node-color" style={{ color: getTextColor(currentNode.color) }}>Color</label>
        <input
          type="color"
          id="node-color"
          value={currentNode.color || "#1e3c72"}
          onChange={(e) => {
            setStory(prev => ({
              ...prev,
              [currentNodeId]: {
                ...prev[currentNodeId],
                color: e.target.value
              }
            }));
          }}
          className="color-picker"
          style={{
            border: `2px solid ${getTextColor(currentNode.color)}`
          }}
        />
      </div>

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button
          className="nav-button"
          onClick={goBack}
          disabled={history.length === 0}
          style={{
            color: getTextColor(currentNode.color),
            borderColor: getTextColor(currentNode.color)
          }}
        >
          Go Back
        </button>
      </div>

      {/* Simple Variables List */}
      <div className="variables-summary" style={{
        marginTop: '24px',
        padding: '16px',
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        border: `1px solid ${getTextColor(currentNode.color)}`
      }}>
        <h3 style={{ 
          margin: '0 0 12px 0', 
          color: getTextColor(currentNode.color),
          fontSize: '18px'
        }}>
          📊 Current Variables
        </h3>
        {Object.keys(variables).length === 0 ? (
          <p style={{ 
            color: getTextColor(currentNode.color),
            fontStyle: 'italic',
            opacity: 0.7
          }}>
            No variables created yet.
          </p>
        ) : (
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: getTextColor(currentNode.color)
          }}>
            {Object.entries(variables).map(([variableId, variable]) => (
              <li key={variableId} style={{ marginBottom: '8px' }}>
                <strong>{variable.name}:</strong> {
                  variable.type === VARIABLE_TYPES.SCALE 
                    ? `${variable.value} (${variable.minLabel} to ${variable.maxLabel})`
                    : variable.type === VARIABLE_TYPES.COUNT
                    ? `${variable.value}`
                    : variable.type === VARIABLE_TYPES.PROGRESSION
                    ? `${variable.stages[variable.value]}`
                    : `${variable.value}`
                }
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App
