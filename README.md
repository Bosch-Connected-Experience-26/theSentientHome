# **Your Team at a Glance**

## **Team Name / Tagline**

*[Brief catchy tagline or team name]*

> 💡 **Tip:** Create a sheet of paper with your team name on the desk so mentors and organizers can find you easily! 

*[Feel free to include a picture representing your team here]*

## **Team Members**

| Name | GitHub Handle | Role(s) |
| :--- | :--- | :--- |
| Mariebelle Khaddage | [@mariebelle88](https://github.com/MarieBelle88) | Frontend, UX, Pitcher |
| | | |
| Sebastian Tiesmeyer | @sebastiantiesmeyer(https://github.com/sebastiantiesmeyer) | ML engineer |
| | | |
|Arpad Dusa | @dusarp (https://github.com/dusarp) | Data scientist |
| | | |
|Charlotte Selter | @charlotteselter-hub (https://github.com/charlotteselter-hub) | Product Manager |
| | | |

## **Challenge**

*[Which challenge have you decided to compete for?]*

## **Core Idea**

*[What is your rough solution idea?]*

<br>

## **Miro Board**
https://miro.com/welcomeonboard/N29aSE0wdncrd1o5b1NqWWVVUzFxS21NVDk5dFk1UUhUSHN5N3ZsR0xPUkQvVTZ3V1FKS3VjcDZ3aC9mUWxTMzBDcGt2dm9PVmlTdTdrN1JjSHphMW91UzRTY0pYQWpmWGxlMjc1cmhiWUtoUVQ0amY4dU94UmJ3c2hnOStCcytNakdSWkpBejJWRjJhRnhhb1UwcS9BPT0hdjE=?share_link_id=330566916038

## **Slack Workspace**
https://join.slack.com/t/thesentienthome/shared_invite/zt-40exntktt-K~aAvLRM2srkyQjPEPg2Hg

## **Notion Workspace**
https://www.notion.so/invite/804b7e201762a51d6f8377d7efe39fd475805531

*[Sketch your technical architecture or data flow to help understand your technical approach. You can edit the mermaid chart below:]*

```ChatGPT Plus


mermaid
graph LR;
    subgraph Edge / Hardware
        Sensor[IoT Sensor / Device] -->|MQTT| Gateway[Edge Gateway]
    end
    
    subgraph Cloud / Backend
        Gateway -->|Data Ingestion| API[AssistedHome; AWS API Gateway]
        API <--> DB[(MongoDB)]
        API <--> ML[AWS Agentcore LLM]
        API <--> ext[external information; weather, energy prices]
    end


    
    subgraph Client / UI
        API -->|REST | App[Web / Mobile Dashboard]
    end


-> Please change this graph so:
- MongoDB is connected to Agentcore and Web/Mobile UI
- Agentcore is connected to mongodb, external sources and Web/mobile
- There's a backwards connection from assistedhome to Edge gateway, where the system steers Edge hardware.


graph LR;
    subgraph Edge / Hardware
        Sensor[IoT Sensor / Device] -->|MQTT| Gateway[Edge Gateway]
    end
    
    subgraph Cloud / Backend
        Gateway -->|Data Ingestion| API[AssistedHome; AWS API Gateway]
        API -->|Device Commands / Steering| Gateway

        API <--> DB[(MongoDB)]
        API <--> ML[AWS Agentcore LLM]
        API <--> ext[External Information; Weather, Energy Prices]

        DB <--> ML
        DB <--> App[Web / Mobile Dashboard]
        ML <--> ext
        ML <--> App
    end
    
    subgraph Client / UI
        API -->|REST| App
    end


