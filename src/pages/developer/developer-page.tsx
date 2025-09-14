import { CodeBlock } from '@/components/ui/code-block';

export function DeveloperPage() {
  const codeExamples = [
    {
      language: 'python',
      label: 'Python',
      code: `print("Hello, World!")
      
# Make API request
import requests

response = requests.post(
    "https://api.openllm-platform.com/v1/chat/completions",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    },
    json={
        "model": "meta-llama/Llama-3.2-1B-Instruct",
        "messages": [
            {"role": "user", "content": "Hello!"}
        ]
    }
)

print(response.json())`,
    },
    {
      language: 'javascript',
      label: 'JavaScript',
      code: `console.log("Hello, World!");

// Make API request
const response = await fetch("https://api.openllm-platform.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    model: "meta-llama/Llama-3.2-1B-Instruct",
    messages: [
      { role: "user", content: "Hello!" }
    ]
  })
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: 'bash',
      label: 'cURL',
      code: `# Simple Hello World
echo "Hello, World!"

# Make API request
curl -X POST "https://api.openllm-platform.com/v1/chat/completions" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "meta-llama/Llama-3.2-1B-Instruct",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'`,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Developer Documentation</h1>
          <p className="text-muted-foreground">
            Get started with our API using these code examples. Select a
            language from the dropdown and click the copy button to copy the
            code snippet.
          </p>
        </div>

        <CodeBlock examples={codeExamples} title="API Examples" />
      </div>
    </div>
  );
}
