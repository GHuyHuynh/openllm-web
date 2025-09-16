import { CodeBlock } from '@/components/core/api-code-block';
import pythonIcon from '@/assets/python.svg';
import nodejsIcon from '@/assets/nodejs-icon.svg';
import bashIcon from '@/assets/bash-icon.svg';
import { VLLM_BASE_URL, VLLM_API_KEY, DEFAULT_VLLM_MODEL } from '@/constants/constants';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeveloperPage() {
  const codeExamples = [
    {
      language: 'python',
      label: 'Python',
      languageIcon: <img src={pythonIcon} alt="Python" className="w-4 h-4" />,
      code: `# Please install OpenAI SDK first with: pip3 install openai

from openai import OpenAI

client = OpenAI(
    api_key="${VLLM_API_KEY}", 
    base_url="${VLLM_BASE_URL}v1"
)

response = client.chat.completions.create(
    model="${DEFAULT_VLLM_MODEL}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "What is the capital of Nova Scotia?"},
    ],
)

print(response.choices[0].message.content)`,
    },
    {
      language: 'javascript',
      label: 'Node.js',
      languageIcon: <img src={nodejsIcon} alt="Node.js" className="w-4 h-4" />,
      code: `// Please install OpenAI SDK first with: npm install openai

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: '${VLLM_BASE_URL}v1',
  apiKey: '${VLLM_API_KEY}'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "What is the capital of Nova Scotia?" },
    ],
    model: "${DEFAULT_VLLM_MODEL}",
  });

  console.log(completion.choices[0].message.content);
}

main();`,
    },
    {
      language: 'bash',
      label: 'cURL',
      languageIcon: <img src={bashIcon} alt="Bash" className="w-4 h-4" />,
      code: `curl ${VLLM_BASE_URL}v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${VLLM_API_KEY}" \\
  -d '{
    "model": "${DEFAULT_VLLM_MODEL}",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "What is the capital of Nova Scotia?"
      }
    ]
  }'`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="ghost" className="gap-2 hover:bg-muted/50 transition-colors">
                <ArrowLeft size={16} />
                Back to Chat
              </Button>
            </Link>
          </div>

          {/* Hero Header */}
          <div className="text-center space-y-6 py-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                OpenLLM API Reference
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                OpenAI-compatible RESTful API that works seamlessly with the OpenAI SDK. Start building AI-powered applications with the code examples below.
              </p>
            </div>
          </div>

          {/* Code Examples Section */}
          <div className="space-y-6">
            <CodeBlock examples={codeExamples} title="API Examples" />
          </div>
        </div>
      </div>
    </div>
  );
}
