import os
import markdown
from langchain_openai import ChatOpenAI
from langgraph.graph import MessagesState, StateGraph, END
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.prompts import ChatPromptTemplate
from django.db.models import Q

from claims.models import Vehicle, Part, Claim


OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

class AssistantAgent:
    def __init__(self):
        @tool
        def search_vehicles(query: str) -> str:
            """Search for vehicles in the library"""
            vehicles = Vehicle.objects.filter(Q(make__icontains=query) | Q(model__icontains=query) | Q(year__icontains=query))
            return f'{len(vehicles)} vehicles found:\n' + '\n'.join([f'({vehicle.id}) {vehicle.make} {vehicle.model} {vehicle.year}' for vehicle in vehicles])

        @tool
        def search_parts(query: str) -> str:
            """Search for parts in the library"""
            parts = Part.objects.filter(Q(name__icontains=query) | Q(vehicle__make__icontains=query) | Q(vehicle__model__icontains=query) | Q(vehicle__year__icontains=query))
            return f'{len(parts)} parts found:\n' + '\n'.join([str({'id': part.id, 'name': part.name, 'cost': part.cost, 'vehicleMake': part.vehicle.make, 'vehicleModel': part.vehicle.model, 'vehicleYear': part.vehicle.year}) for part in parts])

        @tool
        def search_claims(query: str) -> str:
            """Search for claims in the library"""
            claims = Claim.objects.filter(Q(name__icontains=query) | Q(region__icontains=query) | Q(vehicle__make__icontains=query) | Q(vehicle__model__icontains=query) | Q(vehicle__year__icontains=query))
            return f'{len(claims)} claims found:\n' + '\n'.join([str({'id': claim.id, 'name': claim.name, 'region': claim.region, 'href': f'/claims/{claim.id}', 'make': claim.vehicle.make, 'model': claim.vehicle.model, 'year': claim.vehicle.year}) for claim in claims])

        graph_builder = StateGraph(MessagesState)
        tools = [search_vehicles, search_parts, search_claims]

        llm = ChatOpenAI(model='gpt-4o', temperature=0, api_key=OPENAI_API_KEY, streaming=True)
        llm_with_tools = llm.bind_tools(tools)

        def agent(state: MessagesState):
            prompt_template = """You are a helpful assistant with access to a vast library of vehicles, parts, and vehicle insurance claims.

            Respond to the following chat with a claims agent in markdown format.

            When searching by region, use the abbreviation of the state, e.g. "CA" instead of "California" for the query. Do not use "region:CA", just "CA".

            When giving links, start each link with / rather than with a schema or domain name."""
            prompt = ChatPromptTemplate([
                ('system', prompt_template),
                ('placeholder', '{messages}'),
            ])
            chain = prompt | llm_with_tools
            message = chain.invoke({'messages': state['messages']})
            return {'messages': [message]}

        graph_builder.add_node('agent', agent)
        tool_node = ToolNode(tools)
        graph_builder.add_node('tools', tool_node)

        graph_builder.set_entry_point('agent')
        graph_builder.add_conditional_edges('agent', tools_condition)
        graph_builder.add_edge('tools', 'agent')
        graph_builder.add_edge('agent', END)

        memory = MemorySaver()
        self.graph = graph_builder.compile(checkpointer=memory)

    def run(self, chat, chat_history):
        for message_chunk, metadata in self.graph.stream(
            {'messages': [*chat_history, ('user', chat)]},
            {'configurable': {'thread_id': '1'}},
            stream_mode="messages"
        ):
            if hasattr(message_chunk, "content") and message_chunk.content:
                print(message_chunk.content)
                yield message_chunk.content
