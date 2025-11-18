from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json
# Impor fungsi fuzzy dari models.py
from .models import calculate_fuzzy_production


def landingpage(request):
    """Render halaman utama/landing page."""
    return render(request, "landingpage.html")

def input_data(request):
    """Render halaman input data."""
    return render(request, "input_data.html")

@require_POST
def analyze_production(request):
    """Menerima data via POST, menjalankan logika fuzzy, dan mengembalikan JSON."""
    try:
        data = json.loads(request.body)
        batik_type = data.get('jenisBatik')
        demand = float(data.get('demand'))
        inventory = float(data.get('inventory'))

        if not all([batik_type, demand is not None, inventory is not None]):
            return JsonResponse({'error': 'Data tidak lengkap.'}, status=400)

        # Panggil fungsi fuzzy logic dari models.py
        result = calculate_fuzzy_production(demand, inventory, batik_type)

        return JsonResponse(result)
    except (json.JSONDecodeError, ValueError, TypeError) as e:
        return JsonResponse({'error': f'Input tidak valid: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Terjadi kesalahan di server: {str(e)}'}, status=500)
