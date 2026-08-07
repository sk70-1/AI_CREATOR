import app from '../src/app';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error) {
    console.error('Serverless handler crash:', error);
    res.status(500).json({ success: false, error: 'Function crashed' });
  }
}
