import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO, GPT_4 } from "./constants";

export const createModel = (settings: ModelSettings) => {
  let _settings: ModelSettings | undefined = settings;
  if (!settings.customModelName) {
    _settings = undefined;
  }

  const modelname = _settings?.customModelName || GPT_35_TURBO;
  console.log("Connecting OpenAI model:", modelname);
  return new OpenAI({
    openAIApiKey: _settings?.customApiKey || process.env.OPENAI_API_KEY,
    temperature: _settings?.customTemperature || 0.9,
    modelName: modelname,
    maxTokens: _settings?.maxTokens || 400,
  });
};

export const snowflakeSQLPrompt = new PromptTemplate({
  template:
    "You are a Snowflake AI called DataGPT. You have the following statement: `{sql}`. Generate a SQL statement or correct it so that it can be used in Snowflake directly. Return the response as a SQL statement and NOTHING ELSE",
  inputVariables: ["sql"],
});

export const snowflakeCachePrompt = new PromptTemplate({
  template:
    "You are a Snowflake AI called DataGPT. You have the following statement: `{sql}`. Generate a syntactically correct query or correct it to be able to run directly on Snowflake and check column and table names correctly as defined below. Return the response as a SQL statement and NOTHING ELSE. Below are Snowflake database table catalog, table schema, table names and their columns: `{cache}`",
  inputVariables: ["sql", "cache"],
});

export const cachedTables = `
  [
    {
      TABLE_CATALOG: 'SNOWFLAKE_SAMPLE_DATA',
      TABLE_SCHEMA: 'TPCH_SF1',
    },
    {
      TABLE_NAME: 'PARTSUPP',
      COLUMNS: 'PS_AVAILQTY, PS_COMMENT, PS_PARTKEY, PS_SUPPKEY, PS_SUPPLYCOST'
    },
    {
      TABLE_NAME: 'ORDERS',
      COLUMNS: 'O_CLERK, O_COMMENT, O_CUSTKEY, O_ORDERDATE, O_ORDERKEY, O_ORDERPRIORITY, O_ORDERSTATUS, O_SHIPPRIORITY, O_TOTALPRICE'
    },
    {
      TABLE_NAME: 'LINEITEM',
      COLUMNS: 'L_COMMENT, L_COMMITDATE, L_DISCOUNT, L_EXTENDEDPRICE, L_LINENUMBER, L_LINESTATUS, L_ORDERKEY, L_PARTKEY, L_QUANTITY, L_RECEIPTDATE, L_RETURNFLAG, L_SHIPDATE, L_SHIPINSTRUCT, L_SHIPMODE, L_SUPPKEY, L_TAX'
    },
    {
      TABLE_NAME: 'NATION',
      COLUMNS: 'N_COMMENT, N_NAME, N_NATIONKEY, N_REGIONKEY'
    },
    {
      TABLE_NAME: 'CUSTOMER',
      COLUMNS: 'C_ACCTBAL, C_ADDRESS, C_COMMENT, C_CUSTKEY, C_MKTSEGMENT, C_NAME, C_NATIONKEY, C_PHONE'
    },
    {
      TABLE_NAME: 'SUPPLIER',
      COLUMNS: 'S_ACCTBAL, S_ADDRESS, S_COMMENT, S_NAME, S_NATIONKEY, S_PHONE, S_SUPPKEY'
    },
    { TABLE_NAME: 'REGION', COLUMNS: 'R_COMMENT, R_NAME, R_REGIONKEY' },
    {
      TABLE_NAME: 'PART',
      COLUMNS: 'P_BRAND, P_COMMENT, P_CONTAINER, P_MFGR, P_NAME, P_PARTKEY, P_RETAILPRICE, P_SIZE, P_TYPE'
    }
  ]`;

export const startGoalPrompt = new PromptTemplate({
  template:
    "You are an autonomous task creation AI called DataGPT. You have the following objective `{goal}`. Create a list of zero to three tasks to be completed by your AI system such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse()",
  inputVariables: ["goal"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    "You are an autonomous task execution AI called DataGPT. You have the following objective `{goal}`. You have the following tasks `{task}`. Execute the task and return the response as a string.",
  inputVariables: ["goal", "task"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    "You are an AI task creation agent. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE",
  inputVariables: ["goal", "tasks", "lastTask", "result"],
});
