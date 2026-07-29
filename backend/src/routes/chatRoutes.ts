import { Router } from 'express';
import {
  sendMessage,
  getAssistantModes,
  getHealth,
  batchSendMessages,
  getConversationHistory,
  getConversationSummary,
  deleteConversation
} from '../controllers/chatController.js';

const router = Router();

/**
 * Chat endpoints
 */

// Send single message
router.post('/send', sendMessage);

// Send batch messages
router.post('/batch', batchSendMessages);

// Get available assistant modes
router.get('/modes', getAssistantModes);

// Health check
router.get('/health', getHealth);

/**
 * Conversation endpoints
 */

// Get conversation history
router.get('/conversation/:conversationId', getConversationHistory);

// Get conversation summary
router.get('/conversation/:conversationId/summary', getConversationSummary);

// Delete conversation
router.delete('/conversation/:conversationId', deleteConversation);

export default router;
