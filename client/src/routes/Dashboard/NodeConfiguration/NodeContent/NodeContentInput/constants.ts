export const FIXED_NODE_CONTENT_KEYS = ['name', 'type', 'template', 'input']

export const NODE_CONTENT_DEFAULT_VALUE = FIXED_NODE_CONTENT_KEYS.map(item => ({
  key: item
}))

export enum NODE_TYPE {
  process = 'process',
  policy = 'policy',
  search = 'search'
}

export enum POLICY_KEY {
  validKey = 'valid_key',
  validValue = 'valid_value'
}

export interface ICascadeOption {
  value: string | number
  label: string
  children?: ICascadeOption[]
}

export const templateOptions: ICascadeOption[] = [
  {
    value: 'summary',
    label: 'MedQSum',
    children: [
      {
        value: 'summary-0',
        label: '13c02904-e4e2-4b4f-b115-44b437d22041'
      },
      {
        value: 'summary-1',
        label: '30292806-8e58-463c-8d92-ba525411c6fa'
      },
      {
        value: 'summary-2',
        label: '3d388a1e-3361-407b-baa7-61397cc58382'
      },
      {
        value: 'summary-3',
        label: '4cfe4126-b9f5-44eb-8a98-973987c5f32e'
      },
      {
        value: 'summary-4',
        label: '57a7a3f1-91f8-4f4b-b72d-745d7cb7b1e3'
      },
      {
        value: 'summary-5',
        label: '65a3c419-57e9-48c2-b090-0c5d7adb23c6'
      },
      {
        value: 'summary-6',
        label: '752fda48-e64c-47a7-8342-17c2c113f600'
      },
      {
        value: 'summary-7',
        label: '826ffcd4-c0e6-4f4c-bd9a-fcf8ee169ede'
      },
      {
        value: 'summary-8',
        label: '9a3f617f-628f-4fa5-9b74-47d0b166a487'
      },
      {
        value: 'summary-9',
        label: 'd878b768-9da2-4d9d-9517-1edcca3b1b26'
      }
    ]
  },
  {
    value: 'intent_classification',
    label: 'intent_classification',
    children: [
      {
        value: 'intent_classification-0',
        label: '24e44a81-a18a-42dd-a71c-5b31b2d2cb39'
      },
      {
        value: 'intent_classification-1',
        label: '8fdc1056-1029-41a1-9c67-354fc2b8ceaf'
      }
    ]
  },
  {
    value: 'similarity_eval',
    label: 'MedSTS',
    children: [
      {
        value: 'similarity_eval-0',
        label: '11d1c505-9232-4c35-82a4-4c3642843e2e'
      },
      {
        value: 'similarity_eval-1',
        label: '228fcae7-7f4c-4e3c-9ac4-e49b26bc103d'
      },
      {
        value: 'similarity_eval-2',
        label: '6dd74cd5-e074-4612-9e96-c17ca88c3bc4'
      }
    ]
  },
  {
    value: 'misinfo_eval',
    label: 'TruthfulQA',
    children: [
      {
        value: 'misinfo_eval-0',
        label: '50238ba3-15ab-46f1-8c8b-fd6e038eceb3'
      },
      {
        value: 'misinfo_eval-1',
        label: '5980c232-d5c1-4cfa-9e50-7533fab7f5d6'
      },
      {
        value: 'misinfo_eval-2',
        label: '8da874a6-0749-43fd-bff6-1e32d3e0a9f9'
      },
      {
        value: 'misinfo_eval-3',
        label: 'cc25e0aa-ff4f-40e3-a05a-634cdbd6f1d9'
      },
      {
        value: 'misinfo_eval-4',
        label: 'f0711ab7-3093-463a-9493-9ace26df99e3'
      }
    ]
  },
  {
    value: 'toxicity_eval',
    label: 'realtoxicityprompts',
    children: [
      {
        value: 'toxicity_eval-0',
        label: '50238ba3-15ab-46f1-8c8b-fd6e038eceb3'
      },
      {
        value: 'toxicity_eval-1',
        label: '5980c232-d5c1-4cfa-9e50-7533fab7f5d6'
      },
      {
        value: 'toxicity_eval-2',
        label: '8da874a6-0749-43fd-bff6-1e32d3e0a9f9'
      },
      {
        value: 'toxicity_eval-3',
        label: 'cc25e0aa-ff4f-40e3-a05a-634cdbd6f1d9'
      },
      {
        value: 'toxicity_eval-4',
        label: 'f0711ab7-3093-463a-9493-9ace26df99e3'
      },
      {
        value: 'toxicity_eval-5',
        label: 'f0711ab7-3093-463a-9493-9ace26df99e4'
      }
    ]
  },
  {
    value: 'bias_eval',
    label: 'crows_pairs',
    children: [
      {
        value: 'bias_eval-0',
        label: '50238ba3-15ab-46f1-8c8b-fd6e038eceb3'
      },
      {
        value: 'bias_eval-1',
        label: '5980c232-d5c1-4cfa-9e50-7533fab7f5d6'
      },
      {
        value: 'bias_eval-2',
        label: '8da874a6-0749-43fd-bff6-1e32d3e0a9f9'
      },
      {
        value: 'bias_eval-3',
        label: 'cc25e0aa-ff4f-40e3-a05a-634cdbd6f1d9'
      },
      {
        value: 'bias_eval-4',
        label: 'f0711ab7-3093-463a-9493-9ace26df99e3'
      },
      {
        value: 'bias_eval-5',
        label: 'f0711ab7-3093-463a-9493-9ace26df99e4'
      }
    ]
  }

]

export const typeOptions = templateOptions
