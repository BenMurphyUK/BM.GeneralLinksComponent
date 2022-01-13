using BM.GeneralLinksComponent.LinkTypes;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;

namespace BM.GeneralLinksComponent.JsonConverters
{
    internal class GeneralLinkConverter : JsonConverter
    {
        public override bool CanWrite => false;
        public override bool CanRead => true;
        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(GeneralLink);
        }
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            throw new InvalidOperationException("Use default serialization.");
        }
        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var generalLink = new GeneralLink();
            var jsonObject = JObject.Load(reader);
            var linkType = (int)jsonObject["linkType"];
            switch (linkType)
            {
                case (int)LinkType.ExternalLink:
                    generalLink.Link = new ExternalLink();
                    break;
                case (int)LinkType.InternalLink:
                    generalLink.Link = new InternalLink();
                    break;
                case (int)LinkType.Mailto:
                    generalLink.Link = new EmailLink();
                    break;
                case (int)LinkType.PhoneNumber:
                    generalLink.Link = new PhoneNumberLink();
                    break;
                case (int)LinkType.AnchorOrQueryStringOnly:
                    generalLink.Link = new BaseLink();
                    break;
            }
            serializer.Populate(jsonObject.CreateReader(), generalLink);
            return generalLink;
        }
    }
}
