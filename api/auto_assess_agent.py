import os
import re
import json
import base64
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage
from typing import List
from typing_extensions import TypedDict

from claims.models import Part, Damage

OPENAI_API_KEY = os.environ['OPENAI_API_KEY']


class AutoAssessAgent:
    def __init__(self):
        class State(TypedDict):
            messages: List
            image_data: str
            vehicle_data: dict
            parts: List
            error: str | None

        def detect_parts(state: State):
            """Assesses location and severity of damage to a vehicle from images."""
            llm_vision = ChatOpenAI(model='gpt-4o', temperature=0, api_key=OPENAI_API_KEY)

            prompt = f"""You are an expert auto insurance claims adjuster. Analyze vehicle damage and provide a detailed assessment.

            Please provide your analysis in the following JSON format for each damaged part:
            {{
                "name": "Specific part of the vehicle that is damaged (e.g., 'Front windshield', 'Passenger door')",
                "repairType": "Type of repair needed (e.g., 'replace', 'repair', 'refinish')",
                "partsCost": "Estimated cost of parts in USD",
                "laborCost": "Estimated cost of labor in USD"
            }}

            Be thorough in your analysis and provide accurate cost estimates based on typical auto repair costs. Respond only with the JSON object.
            """
            image_data = state['image_data']
            message = HumanMessage(
                content=[
                    {
                        'type': 'text',
                        'text': prompt
                    },
                    *[{
                        'type': 'image_url',
                        'image_url': {
                            'url': f'data:image/jpeg;base64,{image}'
                        }
                    } for image in image_data]
                ]
            )

            try:
                response = llm_vision.invoke([message])
                response_text = response.content
                json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
                if json_match:
                    parts = json.loads(json_match.group())
                    for part in parts:
                        part['partsCostSource'] = Damage.SOURCE_LLM
                        part['laborCostSource'] = Damage.SOURCE_LLM
                    messages = state['messages']
                    messages += [
                        ('assistant', response_text)
                    ]
                    return {'messages': messages, 'parts': parts}
                else:
                    messages = state['messages']
                    messages += [
                        ('assistant', f'Error finding damaged parts in the images.')
                    ]
                    return {'messages': messages, 'parts': [], 'error': 'Error finding damaged parts in the images.'}

            except Exception as e:
                messages = state['messages']
                messages += [
                    ('assistant', f'Error: {e}')
                ]
                return {'messages': messages, 'parts': [], 'error': 'Error: ' + str(e)}

        def estimate_cost(state: State):
            """Attempts to look up costs in parts library."""
            parts = state['parts']
            num_found = 0
            vehicle_data = state['vehicle_data']
            make = vehicle_data['make']
            model = vehicle_data['model']
            year = vehicle_data['year']
            for part in parts:
                if part['repairType'] == 'replace' and Part.objects.filter(vehicle__make=make).filter(vehicle__model=model).filter(vehicle__year=year).filter(name=part['name']).exists():
                    part_lookup = Part.objects.filter(vehicle__make=make).filter(vehicle__model=model).filter(vehicle__year=year).filter(name=part['name']).first()
                    part['partsCost'] = part_lookup.cost
                    part['partsCostSource'] = Damage.SOURCE_LIBRARY
                    num_found += 1
            messages = state['messages']
            messages += [
                ('assistant', f'{num_found} costs of parts have been estimated.')
            ]
            return {'messages': messages, 'parts': parts}

        graph_builder = StateGraph(State)
        graph_builder.add_node('detect_parts', detect_parts)
        graph_builder.add_node('estimate_cost', estimate_cost)

        graph_builder.set_entry_point('detect_parts')
        graph_builder.add_edge('detect_parts', 'estimate_cost')
        graph_builder.add_edge('estimate_cost', END)

        self.graph = graph_builder.compile()

        memory = MemorySaver()
        self.graph = graph_builder.compile(checkpointer=memory)

    def run(self, vehicle, media_list):
        vehicle_data = {
            'make': vehicle.make,
            'model': vehicle.model,
            'year': vehicle.year,
        }
        image_data = []
        for media in media_list:
            with open(media.file.path, 'rb') as image_file:
                image_data.append(base64.b64encode(image_file.read()).decode('utf-8'))

        result = self.graph.invoke({'messages': [('user', 'Please assess the damage to the vehicle from the given image(s).')], 'image_data': image_data, 'vehicle_data': vehicle_data, 'error': None}, {'configurable': {'thread_id': '1'}})
        if result['error'] is not None:
            print(result['error'])
        return result['parts']
