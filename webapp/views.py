from django.shortcuts import render


def landingpage(request):
    return render(request, "landingpage.html")

# INPUT DATA PAGE
def input_data(request):
    return render(request, "input_data.html")


# PROSES ANALISIS
from django.shortcuts import redirect, render


def landingpage(request):
    return render(request, "landingpage.html")

def input_data(request):
    return render(request, "input_data.html")

def hasil(request):
    return render(request, "hasil.html")


def analisis(request):
    if request.method != 'POST':
        return redirect('input_data')

    # Ambil data dari form
    character = request.POST.get('character')
    capital = request.POST.get('capital')
    capacity = request.POST.get('capacity')
    collateral = request.POST.get('collateral')

    # Mapping nilai (contoh, nanti bisa diganti fuzzy)
    score_map = {
        "Tidak Baik": 20,
        "Cukup Baik": 60,
        "Baik": 90,

        "Tidak Setuju": 20,
        "Cukup Setuju": 60,
        "Setuju": 90,

        "Rendah": 30,
        "Sedang": 60,
        "Tinggi": 90,

        "Tidak Mandiri": 25,
        "Campuran": 55,
        "Mandiri": 90
    }

    total_score = (
        score_map.get(character, 0) +
        score_map.get(capital, 0) +
        score_map.get(capacity, 0) +
        score_map.get(collateral, 0)
    ) / 4

    keputusan = "LAYAK Kredit" if total_score >= 70 else "TIDAK Layak Kredit"

    context = {
        'character': character,
        'capital': capital,
        'capacity': capacity,
        'collateral': collateral,
        'score': round(total_score, 2),
        'keputusan': keputusan
    }

    return render(request, 'hasil.html', context)


# HALAMAN HASIL
def hasil(request):
    return render(request, "hasil.html")
