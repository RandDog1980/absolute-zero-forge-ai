
// Export all agents from their individual files
export { alexAgent } from './agents/alexAgent';
export { dataMasterChenAgent } from './agents/dataMasterChenAgent';
export { donAgent } from './agents/donAgent';
export { emmaAgent } from './agents/emmaAgent';
export { grandmaRoseAgent } from './agents/grandmaRoseAgent';
export { professorWilliamAgent } from './agents/professorWilliamAgent';

// Export the main predefined agents array
import { alexAgent } from './agents/alexAgent';
import { dataMasterChenAgent } from './agents/dataMasterChenAgent';
import { donAgent } from './agents/donAgent';
import { emmaAgent } from './agents/emmaAgent';
import { grandmaRoseAgent } from './agents/grandmaRoseAgent';
import { professorWilliamAgent } from './agents/professorWilliamAgent';

export const predefinedAgents = [
  alexAgent,
  grandmaRoseAgent,
  professorWilliamAgent,
  emmaAgent,
  donAgent,
  dataMasterChenAgent
];
