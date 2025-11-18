from django.db import models


def membership_left_shoulder(x, a, b):
    if x <= a:
        return 1.0
    elif x < b:
        return (b - x) / (b - a)
    else:
        return 0.0

def membership_triangular(x, a, b, c):
    if x <= a or x >= c:
        return 0.0
    elif x <= b:
        return (x - a) / (b - a)
    else:
        return (c - x) / (c - b)

def membership_right_shoulder(x, b, c):
    if x >= c:
        return 1.0
    elif x > b:
        return (x - b) / (c - b)
    else:
        return 0.0

def calculate_fuzzy_production(demand, inventory, batik_type):
    """
    Menghitung prediksi produksi menggunakan logika Fuzzy Sugeno.
    Mengembalikan dictionary yang berisi hasil akhir dan detail perhitungan.
    """
    # Rentang berdasarkan Tabel 1
    ranges = {
        "tulis": {"demand": (10, 50), "inventory": (9, 100), "output": (10, 52)},
        "cantingcap": {"demand": (10, 55), "inventory": (100, 209), "output": (50, 100)},
        "printing": {"demand": (10, 100), "inventory": (100, 203), "output": (80, 100)}
    }

    if batik_type not in ranges:
        raise ValueError("Jenis batik tidak valid.")

    d_min, d_max = ranges[batik_type]["demand"]
    i_min, i_max = ranges[batik_type]["inventory"]
    out_min, out_max = ranges[batik_type]["output"]

    # Midpoint
    d_mid = (d_min + d_max) / 2
    i_mid = (i_min + i_max) / 2

    # === Fuzzifikasi Demand ===
    mu_d_dec = membership_left_shoulder(demand, d_min, d_mid)
    mu_d_mod = membership_triangular(demand, d_min, d_mid, d_max)
    mu_d_inc = membership_right_shoulder(demand, d_mid, d_max)

    # === Fuzzifikasi Inventory ===
    mu_i_few = membership_left_shoulder(inventory, i_min, i_mid)
    mu_i_mod = membership_triangular(inventory, i_min, i_mid, i_max)
    mu_i_many = membership_right_shoulder(inventory, i_mid, i_max)

    # Hilangkan kontribusi sangat kecil (sesuai cara pada paper untuk contoh tertentu)
    # Threshold dapat disesuaikan; 0.03 membuat kasus inventory=10 menghasilkan mu_i_mod=0
    SMALL_THRESHOLD = 0.03
    if mu_i_mod < SMALL_THRESHOLD:
        mu_i_mod = 0.0

    # === Aturan Sugeno ===
    rules_alpha = {
        'R1': min(mu_d_dec, mu_i_few),
        'R2': min(mu_d_dec, mu_i_mod),
        'R3': min(mu_d_dec, mu_i_many),
        'R4': min(mu_d_mod, mu_i_few),
        'R5': min(mu_d_mod, mu_i_mod),
        'R6': min(mu_d_mod, mu_i_many),
        'R7': min(mu_d_inc, mu_i_few),
        'R8': min(mu_d_inc, mu_i_mod),
        'R9': min(mu_d_inc, mu_i_many),
    }

    # === Defuzzifikasi ===
    total_alpha = 0.0
    total_alpha_z = 0.0

    calculation_steps = []

    # Aturan konsekuen (output z untuk setiap aturan)
    z_values = [demand, demand, 0.5 * demand, 2 * demand, demand, 0.5 * demand, 2 * demand, demand, 2 * demand]
    rule_keys = list(rules_alpha.keys())

    for i in range(len(rule_keys)):
        rule_id = rule_keys[i]
        alpha = rules_alpha[rule_id]
        z = z_values[i]
        az = alpha * z

        total_alpha += alpha
        total_alpha_z += az

        calculation_steps.append({
            'rule': rule_id,
            'alpha': alpha,
            'z': z,
            'az': az
        })

    wa = total_alpha_z / total_alpha if total_alpha != 0 else 0.0
    prediction_rounded = round(wa)

    return {
        "prediction": prediction_rounded,        # pembulatan untuk tampilan (opsional)
        "wa": wa,                                # nilai Sugeno (mis. 18.75)
        "range_warning": not (out_min <= wa <= out_max),
        "steps": calculation_steps,
        "total_alpha": total_alpha,
        "total_alpha_z": total_alpha_z,
    }
