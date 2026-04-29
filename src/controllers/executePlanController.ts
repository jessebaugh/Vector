import { Request, Response } from 'express';

// Adjusted paths to match your structure
import { executePlan } from '../tools/workflowEngine';

export const executePlanController = async (req: Request, res: Response) => {
  try {
    const plan = req.body;

    if (!plan) {
      return res.status(400).json({ error: 'Missing plan in request body.' });
    }

    // Stream logs as the plan executes
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Start the plan execution
    const execution = await executePlan(plan);

    // When finished, send final result
    res.write(JSON.stringify({ event: 'result', data: execution }) + '\n');
    res.end();


    // When finished, send final result
    res.write(JSON.stringify({ event: 'result', data: execution }) + '\n');
    res.end();

  } catch (err: any) {
    console.error('executePlan error:', err);
    res.status(500).json({
      error: 'Failed to execute plan.',
      details: err.message,
    });
  }
};
