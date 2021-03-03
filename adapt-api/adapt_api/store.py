from twks.client import TwksClient


def get_store(host: str, port: int) -> TwksClient:
    return TwksClient(server_base_url=f'{host}:{port}')
