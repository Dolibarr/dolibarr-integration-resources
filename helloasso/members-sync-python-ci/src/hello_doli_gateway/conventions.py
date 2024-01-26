from unidecode import unidecode


def crush(x: str):
    return unidecode(x.lower().replace(" ", "").replace("'", "").replace("-", "") if x is not None else '')


class ConfigurationError(NameError):
    pass
