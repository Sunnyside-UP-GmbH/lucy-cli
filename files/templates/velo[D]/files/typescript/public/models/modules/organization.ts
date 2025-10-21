import { Schema } from 'effect/index';
import { createResponseDTOSchema } from 'public/lib/dto/response.dto';
import { createRequestDTOSchema } from 'public/lib/dto/shared/request.dto';
import { ResponseDTO } from 'public/lib/models/dto/response.model';
import { multireferenceSchema } from 'public/lib/models/wix/common/common.model';
import { organizationSchema } from 'public/models/collections/organization.model';

import { stageSchema } from '../collections/stage.model';
import { tagSchema } from '../collections/tag.model';

export const organizationFullSchema = Schema.Struct({
	...organizationSchema.fields,
	tags: multireferenceSchema(tagSchema),
	stage: stageSchema, // Assuming stage is a string, adjust if it's different 
});

// export type GetOrganizationDTO = ResponseDTO<typeof organizationFullSchema.Type | undefined>;
// export const getOrganizationDTOSchema = createResponseDTOSchema(organizationFullSchema);
// export type GetSingleOrganizationDTO = ResponseDTO<typeof organizationFullSchema.Type>;
// export const requestOrganizationDTOSchema = createRequestDTOSchema(Schema.String);