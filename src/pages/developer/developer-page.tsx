import { CodeBlock } from '@/components/core/api-code-block';
import pythonIcon from '@/assets/python.svg';
import javascriptIcon from '@/assets/javascript.svg';
import bashIcon from '@/assets/bash-icon.svg';
import { VLLM_BASE_URL, VLLM_API_KEY } from '@/constants/constants';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeveloperPage() {
  const codeExamples = [
    {
      language: 'python',
      label: 'Python',
      languageIcon: <img src={pythonIcon} alt="Python" className="w-4 h-4" />,
      code: `from openai import OpenAI
 
client = OpenAI(
    base_url="${VLLM_BASE_URL}v1",
    api_key="${VLLM_API_KEY}"
)
 
result = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of Nova Scotia?"}
    ]
)
 
print(result.choices[0].message.content)
 
response = client.responses.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    instructions="You are a helfpul assistant.",
    input="What is the capital of Nova Scotia?"
)
 
print(response.output_text)`,
    },
    {
      language: 'javascript',
      label: 'JavaScript',
      languageIcon: <img src={javascriptIcon} alt="JavaScript" className="w-4 h-4" />,
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  baseUrl: "${VLLM_BASE_URL}v1",
  apiKey: "${VLLM_API_KEY}",
});

const completion = await client.chat.completions.create({
  model: 'meta-llama/Llama-3.2-1B-Instruct',
  messages: [
    { role: 'developer', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of Nova Scotia?' },
  ],
});

console.log(completion.choices[0].message.content);

const response = await client.responses.create({
  model: 'meta-llama/Llama-3.2-1B-Instruct',
  instructions: 'You are a helpful assistant.',
  input: 'What is the capital of Nova Scotia?',
});

console.log(response.output_text);`,
    },
    {
      language: 'bash',
      label: 'cURL',
      languageIcon: <img src={bashIcon} alt="Bash" className="w-4 h-4" />,
      code: `curl ${VLLM_BASE_URL}/v1/chat/completions \

      -H "Content-Type: application/json" \

      -H "Authorization: Bearer ${VLLM_API_KEY}" \

      -d '{
        "model": "meta-llama/Llama-3.2-1B-Instruct",
        "messages": [
          {
            "role": "developer",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": "Hello!"
          }
        ]
      }'`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft size={16} />
              Back to Chat
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">OpenLLM API Reference</h1>
          <p className="text-muted-foreground">
            OpenLLM API provides a RESTful API with OpenAI-compatible endpoints. You can use the below code examples to get started.
          </p>
          <p className="text-muted-foreground">
            Pricing: Free!
          </p>
        </div>

        <CodeBlock examples={codeExamples} title="API Examples" />
      </div>
    </div>
  );
}
